import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calculator, 
  X, 
  Home, 
  Utensils, 
  Car, 
  Zap, 
  ShoppingCart,
  Heart,
  Book,
  Gamepad2,
  Shirt,
  Dumbbell,
  Plus,
  Minus,
  RefreshCw,
  ArrowRightLeft,
  Brain,
  Sparkles
} from 'lucide-react';
import { useCalculator } from '../contexts/CalculatorContext';
import currencyService from '../services/currencyService';
import costOfLivingService from '../services/costOfLivingService';
import groqService from '../services/groqService';

const CostCalculatorWidget = () => {
  const { isCalculatorOpen, closeCalculator } = useCalculator();
  const [expenses, setExpenses] = useState({
    rent: 0,
    groceries: 0,
    transport: 0,
    utilities: 0,
    entertainment: 0,
    healthcare: 0,
    education: 0,
    clothing: 0,
    fitness: 0,
    other: 0
  });

  const [baseCurrency, setBaseCurrency] = useState('USD'); // Currency for input
  const [displayCurrency, setDisplayCurrency] = useState('USD'); // Currency for display
  const [isMinimized, setIsMinimized] = useState(false);
  const [showConversion, setShowConversion] = useState(false);
  const [showLocationComparison, setShowLocationComparison] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [comparisonLocation, setComparisonLocation] = useState('');
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [aiInsights, setAiInsights] = useState('');
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [showAiInsights, setShowAiInsights] = useState(false);

  const currencies = currencyService.getSupportedCurrencies();
  const locations = costOfLivingService.getSupportedLocations();

  const expenseCategories = [
    { key: 'rent', label: 'Rent/Mortgage', icon: Home, color: 'text-blue-500' },
    { key: 'groceries', label: 'Groceries', icon: Utensils, color: 'text-green-500' },
    { key: 'transport', label: 'Transportation', icon: Car, color: 'text-purple-500' },
    { key: 'utilities', label: 'Utilities', icon: Zap, color: 'text-yellow-500' },
    { key: 'entertainment', label: 'Entertainment', icon: Gamepad2, color: 'text-pink-500' },
    { key: 'healthcare', label: 'Healthcare', icon: Heart, color: 'text-red-500' },
    { key: 'education', label: 'Education', icon: Book, color: 'text-indigo-500' },
    { key: 'clothing', label: 'Clothing', icon: Shirt, color: 'text-orange-500' },
    { key: 'fitness', label: 'Fitness', icon: Dumbbell, color: 'text-teal-500' },
    { key: 'other', label: 'Other', icon: ShoppingCart, color: 'text-gray-500' }
  ];

  const totalExpenses = Object.values(expenses).reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
  const currentCurrency = currencies.find(c => c.value === displayCurrency);
  const baseCurrencyInfo = currencies.find(c => c.value === baseCurrency);
  
  // Convert total to display currency if different from base currency
  const convertedTotal = baseCurrency !== displayCurrency 
    ? currencyService.convert(totalExpenses, baseCurrency, displayCurrency)
    : totalExpenses;

  const handleExpenseChange = (key, value) => {
    // Prevent negative values and ensure valid number
    const numericValue = parseFloat(value) || 0;
    const validValue = Math.max(0, numericValue); // Ensure non-negative
    
    setExpenses(prev => ({
      ...prev,
      [key]: validValue
    }));
  };

  const resetCalculator = () => {
    setExpenses({
      rent: 0,
      groceries: 0,
      transport: 0,
      utilities: 0,
      entertainment: 0,
      healthcare: 0,
      education: 0,
      clothing: 0,
      fitness: 0,
      other: 0
    });
  };

  const refreshExchangeRates = async () => {
    setIsLoadingRates(true);
    try {
      await currencyService.refresh();
      setLastUpdated(currencyService.getLastUpdated());
    } catch (error) {
      console.error('Failed to refresh exchange rates:', error);
    } finally {
      setIsLoadingRates(false);
    }
  };

  const swapCurrencies = () => {
    const temp = baseCurrency;
    setBaseCurrency(displayCurrency);
    setDisplayCurrency(temp);
  };

  const getLocationBasedCosts = () => {
    if (!selectedLocation || !showLocationComparison) return null;

    const [countryCode, cityCode] = selectedLocation.split('-');
    const cityData = costOfLivingService.getCityData(countryCode, cityCode);
    
    if (!cityData) return null;

    // Convert to USD for comparison
    const exchangeRates = currencyService.exchangeRates || currencyService.fallbackRates;
    const convertedData = costOfLivingService.convertCostsToUSD(cityData, exchangeRates);

    return {
      rent: convertedData.rent.oneBedroom,
      groceries: convertedData.food.groceries,
      transport: convertedData.transport.public,
      utilities: convertedData.utilities.electricity + convertedData.utilities.water + 
                convertedData.utilities.internet + convertedData.utilities.phone,
      entertainment: convertedData.other.entertainment,
      healthcare: convertedData.other.healthcare,
      clothing: convertedData.other.clothing,
      fitness: convertedData.other.fitness
    };
  };

  const getComparisonInsights = () => {
    if (!selectedLocation || !comparisonLocation || !showLocationComparison) return null;

    const [country1, city1] = selectedLocation.split('-');
    const [country2, city2] = comparisonLocation.split('-');
    
    const city1Data = costOfLivingService.getCityData(country1, city1);
    const city2Data = costOfLivingService.getCityData(country2, city2);

    if (!city1Data || !city2Data) return null;

    return costOfLivingService.compareCities(city1Data, city2Data);
  };

  // Generate AI insights for cost analysis
  const generateAiInsights = async () => {
    setIsGeneratingInsights(true);
    
    try {
      let insightPrompt = '';
      
      if (showLocationComparison && selectedLocation && comparisonLocation) {
        // Location comparison insights
        const [country1, city1] = selectedLocation.split('-');
        const [country2, city2] = comparisonLocation.split('-');
        const city1Data = costOfLivingService.getCityData(country1, city1);
        const city2Data = costOfLivingService.getCityData(country2, city2);
        
        if (city1Data && city2Data) {
          insightPrompt = `
          Analyze this cost of living comparison for migration planning:
          
          Current City: ${city1Data.name}, ${city1Data.country}
          - Rent (1BR): ${city1Data.currency} ${city1Data.rent.oneBedroom}
          - Groceries: ${city1Data.currency} ${city1Data.food.groceries}
          - Transport: ${city1Data.currency} ${city1Data.transport.public}
          - Utilities: ${city1Data.currency} ${city1Data.utilities.electricity + city1Data.utilities.water + city1Data.utilities.internet}
          
          Target City: ${city2Data.name}, ${city2Data.country}
          - Rent (1BR): ${city2Data.currency} ${city2Data.rent.oneBedroom}
          - Groceries: ${city2Data.currency} ${city2Data.food.groceries}
          - Transport: ${city2Data.currency} ${city2Data.transport.public}
          - Utilities: ${city2Data.currency} ${city2Data.utilities.electricity + city2Data.utilities.water + city2Data.utilities.internet}
          
          User's Current Expenses:
          - Rent: ${expenses.rent}
          - Groceries: ${expenses.groceries}
          - Transport: ${expenses.transport}
          - Utilities: ${expenses.utilities}
          
          Provide practical migration insights:
          1. Which city offers better value for money?
          2. What are the 3 biggest cost differences?
          3. Specific money-saving tips for the target city
          4. Hidden costs to watch out for
          5. Budget adjustment recommendations
          
          Keep it practical and actionable. Max 200 words.
          `;
        }
      } else {
        // General budget analysis
        insightPrompt = `
        Analyze this monthly budget for cost optimization:
        
        Monthly Expenses:
        - Rent/Housing: $${expenses.rent}
        - Groceries: $${expenses.groceries}
        - Transportation: $${expenses.transport}
        - Utilities: $${expenses.utilities}
        - Entertainment: $${expenses.entertainment}
        - Healthcare: $${expenses.healthcare}
        - Clothing: $${expenses.clothing}
        - Fitness: $${expenses.fitness}
        - Other: $${expenses.other}
        
        Total: $${totalExpenses}
        
        Provide smart budgeting insights:
        1. Are any categories over/under typical ranges?
        2. Top 3 areas for potential savings
        3. Budget optimization tips
        4. Realistic expense adjustments
        
        Keep it practical and specific. Max 150 words.
        `;
      }
      
      const insights = await groqService.generateCostInsights(insightPrompt);
      setAiInsights(insights);
      setShowAiInsights(true);
      
    } catch (error) {
      console.error('Error generating AI insights:', error);
      setAiInsights('Unable to generate insights at this time. Please try again.');
      setShowAiInsights(true);
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const saveToLocalStorage = () => {
    localStorage.setItem('costCalculator', JSON.stringify({
      expenses,
      baseCurrency,
      displayCurrency,
      showConversion,
      showLocationComparison,
      selectedLocation,
      comparisonLocation,
      aiInsights,
      showAiInsights,
      timestamp: new Date().toISOString()
    }));
  };

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('costCalculator');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setExpenses(data.expenses || expenses);
        setBaseCurrency(data.baseCurrency || baseCurrency);
        setDisplayCurrency(data.displayCurrency || displayCurrency);
        setShowConversion(data.showConversion || false);
        setShowLocationComparison(data.showLocationComparison || false);
        setSelectedLocation(data.selectedLocation || '');
        setComparisonLocation(data.comparisonLocation || '');
        setAiInsights(data.aiInsights || '');
        setShowAiInsights(data.showAiInsights || false);
      } catch (error) {
        console.error('Error loading saved calculator data:', error);
      }
    }
  };

  // Initialize currency service and load data
  useEffect(() => {
    const initializeCalculator = async () => {
      await currencyService.initialize();
      setLastUpdated(currencyService.getLastUpdated());
      loadFromLocalStorage();
    };
    
    initializeCalculator();
  }, []);

  useEffect(() => {
    saveToLocalStorage();
  }, [expenses, baseCurrency, displayCurrency, showConversion, showLocationComparison, selectedLocation, comparisonLocation, aiInsights, showAiInsights]);

  if (!isCalculatorOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-[600px] max-w-[95vw] bg-card/95 backdrop-blur-sm border-border shadow-2xl transition-all duration-300 ${
        isMinimized ? 'h-16' : 'max-h-[90vh] overflow-y-auto'
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              {isMinimized ? 'Calculator' : 'Cost Calculator'}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-6 w-6 p-0"
              >
                {isMinimized ? <Plus className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeCalculator}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
          {!isMinimized && (
            <CardDescription>
              Calculate your monthly expenses
            </CardDescription>
          )}
        </CardHeader>
        
        {!isMinimized && (
          <CardContent className="space-y-4">
            {/* Mode Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-base font-medium">Calculator Mode</label>
                <div className="flex gap-2">
                  <Button
                    variant={showConversion ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setShowConversion(!showConversion);
                      setShowLocationComparison(false);
                    }}
                    className="h-8 text-xs"
                  >
                    Currency Convert
                  </Button>
                  <Button
                    variant={showLocationComparison ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setShowLocationComparison(!showLocationComparison);
                      setShowConversion(false);
                    }}
                    className="h-8 text-xs"
                  >
                    City Compare
                  </Button>
                </div>
              </div>
              
              {showLocationComparison ? (
                <div className="space-y-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border">
                  <div>
                    <label className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2 block">Your Current Location</label>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger className="w-full h-10">
                        <SelectValue placeholder="Select your current city" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map(location => (
                          <SelectItem key={`${location.countryCode}-${location.cityCode}`} 
                                    value={`${location.countryCode}-${location.cityCode}`}>
                            {location.cityName}, {location.countryName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2 block">Target Location</label>
                    <Select value={comparisonLocation} onValueChange={setComparisonLocation}>
                      <SelectTrigger className="w-full h-10">
                        <SelectValue placeholder="Select target city" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map(location => (
                          <SelectItem key={`${location.countryCode}-${location.cityCode}`} 
                                    value={`${location.countryCode}-${location.cityCode}`}>
                            {location.cityName}, {location.countryName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedLocation && comparisonLocation && (
                    <div className="text-sm text-blue-600 dark:text-blue-400 text-center p-2 bg-white/50 dark:bg-gray-800/50 rounded border">
                      ✓ Using real cost-of-living data
                    </div>
                  )}
                </div>
              ) : showConversion ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground">Input Currency</label>
                      <Select value={baseCurrency} onValueChange={setBaseCurrency}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map(curr => (
                            <SelectItem key={curr.value} value={curr.value}>
                              {curr.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={swapCurrencies}
                      className="h-8 w-8 p-0 mt-4"
                    >
                      <ArrowRightLeft className="h-3 w-3" />
                    </Button>
                    
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground">Display Currency</label>
                      <Select value={displayCurrency} onValueChange={setDisplayCurrency}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map(curr => (
                            <SelectItem key={curr.value} value={curr.value}>
                              {curr.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {baseCurrency !== displayCurrency && (
                    <div className="text-xs text-muted-foreground text-center">
                      1 {baseCurrencyInfo?.symbol} = {currencyService.getExchangeRate(baseCurrency, displayCurrency).toFixed(4)} {currentCurrency?.symbol}
                    </div>
                  )}
                </div>
              ) : (
                <Select value={displayCurrency} onValueChange={(value) => {
                  setDisplayCurrency(value);
                  setBaseCurrency(value);
                }}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(curr => (
                      <SelectItem key={curr.value} value={curr.value}>
                        {curr.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Expense Categories */}
            <div className="space-y-4 max-h-80 overflow-y-auto">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">
                  Monthly Expenses 
                  {showConversion && ` (in ${baseCurrencyInfo?.symbol})`}
                  {showLocationComparison && selectedLocation && ' (USD equivalent)'}
                </label>
                <div className="flex gap-1">
                  {showConversion && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={refreshExchangeRates}
                      disabled={isLoadingRates}
                      className="h-6 text-xs"
                    >
                      <RefreshCw className={`h-3 w-3 mr-1 ${isLoadingRates ? 'animate-spin' : ''}`} />
                      Rates
                    </Button>
                  )}
                  {showLocationComparison && selectedLocation && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const locationCosts = getLocationBasedCosts();
                        if (locationCosts) {
                          setExpenses(locationCosts);
                        }
                      }}
                      className="h-6 text-xs"
                    >
                      Use Local Costs
                    </Button>
                  )}
                </div>
              </div>
              
              {expenseCategories.map(({ key, label, icon: Icon, color }) => (
                <div key={key} className="p-3 bg-muted/30 rounded-lg border border-muted">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className={`h-5 w-5 ${color}`} />
                    <label className="text-sm font-medium flex-1">{label}</label>
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={expenses[key]}
                      onChange={(e) => handleExpenseChange(key, e.target.value)}
                      onKeyDown={(e) => {
                        // Prevent minus key
                        if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                          e.preventDefault();
                        }
                      }}
                      placeholder="0"
                      className="w-full text-base"
                    />
                    {showConversion && baseCurrency !== displayCurrency && expenses[key] > 0 && (
                      <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                        ≈ {currencyService.formatCurrency(
                          currencyService.convert(expenses[key], baseCurrency, displayCurrency),
                          displayCurrency
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="pt-3 border-t">
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                  <span className="text-base font-semibold">Total Monthly:</span>
                  <span className="text-xl font-bold text-primary">
                    {currencyService.formatCurrency(convertedTotal, displayCurrency)}
                  </span>
                </div>
                
                {showConversion && baseCurrency !== displayCurrency && (
                  <div className="flex justify-between items-center text-sm text-muted-foreground p-2 bg-muted/30 rounded">
                    <span>Original ({baseCurrencyInfo?.name}):</span>
                    <span className="font-medium">{currencyService.formatCurrency(totalExpenses, baseCurrency)}</span>
                  </div>
                )}

                {/* Location Comparison Insights */}
                {showLocationComparison && (() => {
                  const insights = getComparisonInsights();
                  if (insights) {
                    const { comparison } = insights;
                    return (
                      <div className="text-sm text-muted-foreground space-y-2 p-3 bg-muted/30 rounded-lg border">
                        <div className="font-medium text-base">Location Comparison:</div>
                        <div className="text-sm">
                          {insights.city1.name} vs {insights.city2.name}
                        </div>
                        <div className={`font-medium ${
                          comparison.percentageDifference === 0 ? 'text-blue-500' : 
                          comparison.city1IsMoreExpensive ? 'text-red-500' : 'text-green-500'
                        }`}>
                          {comparison.percentageDifference === 0 ? 
                            `Same city selected - costs are identical` :
                            comparison.city1IsMoreExpensive ? 
                            `${insights.city1.name} is ${comparison.percentageDifference.toFixed(1)}% more expensive` :
                            `${insights.city1.name} is ${comparison.percentageDifference.toFixed(1)}% less expensive`
                          }
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
              
              {/* AI Insights Section */}
              {showAiInsights && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <span className="text-base font-medium text-purple-700 dark:text-purple-300">AI Cost Insights</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAiInsights(false)}
                      className="h-6 w-6 p-0 ml-auto"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400 leading-relaxed whitespace-pre-wrap bg-white/50 dark:bg-gray-800/50 p-3 rounded border">
                    {aiInsights}
                  </div>
                </div>
              )}

              {/* Exchange Rate Info */}
              {lastUpdated && showConversion && (
                <div className="text-xs text-muted-foreground text-center mb-3">
                  Rates updated: {lastUpdated.toLocaleTimeString()}
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    onClick={resetCalculator}
                    className="h-10"
                  >
                    Reset
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={saveToLocalStorage}
                    className="h-10"
                  >
                    Save
                  </Button>
                </div>
                
                {/* AI Insights Button */}
                <Button 
                  onClick={generateAiInsights}
                  disabled={isGeneratingInsights || totalExpenses === 0}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-base font-medium"
                >
                  {isGeneratingInsights ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing Your Budget...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Get AI Insights
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default CostCalculatorWidget;
