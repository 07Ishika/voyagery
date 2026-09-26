import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  Clock,
  Users,
  Heart,
  Home,
  Utensils,
  Car,
  Zap,
  Calculator,
  FileText,
  Stethoscope,
  Plane,
  Building,
  Key,
  Package,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import currencyService from '../services/currencyService';

const MigrantAnalytics = ({ currentCity, targetCity }) => {
  // Create unique keys for city combination
  const storageKey = `salary_${currentCity?.name || 'unknown'}_${targetCity?.name || 'unknown'}`;
  
  // Load saved custom salaries from localStorage (city-specific)
  const [customCurrentSalary, setCustomCurrentSalary] = useState(() => {
    const saved = localStorage.getItem(`${storageKey}_current`);
    return saved || '';
  });
  const [customTargetSalary, setCustomTargetSalary] = useState(() => {
    const saved = localStorage.getItem(`${storageKey}_target`);
    return saved || '';
  });
  const [showSalaryInputs, setShowSalaryInputs] = useState(false);
  const [oneTimeCosts, setOneTimeCosts] = useState({
    visa: '',
    languageMedical: '',
    travel: '',
    temporaryStay: '',
    deposit: '',
    setup: ''
  });

  // Save to localStorage whenever custom salaries change
  const updateCustomCurrentSalary = (value) => {
    setCustomCurrentSalary(value);
    if (value && value.trim() !== '') {
      localStorage.setItem(`${storageKey}_current`, value);
      console.log('💾 Saved current salary:', value, 'for', storageKey);
    } else {
      localStorage.removeItem(`${storageKey}_current`);
    }
  };

  const updateCustomTargetSalary = (value) => {
    setCustomTargetSalary(value);
    if (value && value.trim() !== '') {
      localStorage.setItem(`${storageKey}_target`, value);
      console.log('💾 Saved target salary:', value, 'for', storageKey);
    } else {
      localStorage.removeItem(`${storageKey}_target`);
    }
  };

  const updateOneTimeCost = (field, value) => {
    setOneTimeCosts((previous) => ({ ...previous, [field]: value }));
  };

  // Load saved values when cities change
  useEffect(() => {
    const currentSaved = localStorage.getItem(`${storageKey}_current`);
    const targetSaved = localStorage.getItem(`${storageKey}_target`);
    
    if (currentSaved) {
      setCustomCurrentSalary(currentSaved);
      console.log('📂 Loaded current salary:', currentSaved);
    } else {
      setCustomCurrentSalary('');
    }
    
    if (targetSaved) {
      setCustomTargetSalary(targetSaved);
      console.log('📂 Loaded target salary:', targetSaved);
    } else {
      setCustomTargetSalary('');
    }
  }, [storageKey]);
  // Use the same city snapshot shown on the Cost of Living page.
  const buildCosts = (city) => {
    if (!city) return null;

    const housing = city.rent?.oneBedroom || 0;
    const currency = city.currency || 'USD';
    const hasSnapshotTotal = city.monthlyExcludingRent !== undefined;
    const food = (city.food?.groceries || 0) + (city.food?.restaurant || 0);
    const transport = city.transport?.public || 0;
    const utilities = (city.utilities?.electricity || 0) + (city.utilities?.water || 0) +
      (city.utilities?.internet || 0) + (city.utilities?.phone || 0);

    return {
      housing,
      food,
      transport,
      utilities,
      currency,
      total: hasSnapshotTotal
        ? city.monthlyExcludingRent + housing
        : housing + food + transport + utilities
    };
  };

  const currentCosts = buildCosts(currentCity);
  const targetCosts = buildCosts(targetCity);

  const currentSalaryCurrency = currentCity?.currency || 'USD';
  const targetSalaryCurrency = targetCity?.currency || 'USD';
  const currentMonthlySalary = customCurrentSalary ? parseFloat(customCurrentSalary) : null;
  const targetMonthlySalary = customTargetSalary ? parseFloat(customTargetSalary) : null;
  const hasSalaryInputs = Number.isFinite(currentMonthlySalary) && Number.isFinite(targetMonthlySalary);

  // Compare each salary directly with the corresponding Numbeo estimate.
  const salaryBudgetData = currentCosts && targetCosts && hasSalaryInputs ? [
    {
      level: `Current\n${currentCity.name}`,
      monthlySalary: Math.round(currentMonthlySalary),
      livingCosts: Math.round(currentCosts.total),
      savings: Math.round(currentMonthlySalary - currentCosts.total),
      canAfford: currentMonthlySalary >= currentCosts.total,
      currency: currentSalaryCurrency
    },
    {
      level: `Target\n${targetCity.name}`,
      monthlySalary: Math.round(targetMonthlySalary),
      livingCosts: Math.round(targetCosts.total),
      savings: Math.round(targetMonthlySalary - targetCosts.total),
      canAfford: targetMonthlySalary >= targetCosts.total,
      currency: targetSalaryCurrency
    }
  ] : [];

  // One-time migration costs are user inputs; no destination cost is invented.
  const migrationBudgetData = [
    { phase: 'Visa & documents', cost: Number(oneTimeCosts.visa) || 0, items: 'Visa fees, document preparation and legal assistance' },
    { phase: 'Language & medical', cost: Number(oneTimeCosts.languageMedical) || 0, items: 'Language tests, medical exams and police clearance' },
    { phase: 'Travel & moving', cost: Number(oneTimeCosts.travel) || 0, items: 'Flights, baggage and shipping' },
    { phase: 'Temporary accommodation', cost: Number(oneTimeCosts.temporaryStay) || 0, items: 'Short-term stay before permanent housing' },
    { phase: 'Housing deposit', cost: Number(oneTimeCosts.deposit) || 0, items: 'Security deposit and initial rent' },
    { phase: 'Initial setup', cost: Number(oneTimeCosts.setup) || 0, items: 'Furniture, registration, essential purchases' }
  ];

  const hasComparableCategories = currentCosts && targetCosts &&
    currentCity.monthlyExcludingRent === undefined && targetCity.monthlyExcludingRent === undefined &&
    currentCosts.currency === targetCosts.currency;

  // Category comparison is shown only when both city records provide the same currency basis.
  const locationComparisonData = hasComparableCategories ? [
    { 
      category: 'Housing', 
      current: currentCosts.housing, 
      target: targetCosts.housing, 
      difference: currentCosts.housing > 0 ? 
        `${targetCosts.housing > currentCosts.housing ? '+' : ''}${Math.round(((targetCosts.housing - currentCosts.housing) / currentCosts.housing) * 100)}%` : 'N/A',
      impact: Math.abs(targetCosts.housing - currentCosts.housing) > 1000 ? 'High' : 
              Math.abs(targetCosts.housing - currentCosts.housing) > 500 ? 'Medium' : 'Low'
    },
    { 
      category: 'Food & Dining', 
      current: currentCosts.food, 
      target: targetCosts.food, 
      difference: currentCosts.food > 0 ? 
        `${targetCosts.food > currentCosts.food ? '+' : ''}${Math.round(((targetCosts.food - currentCosts.food) / currentCosts.food) * 100)}%` : 'N/A',
      impact: Math.abs(targetCosts.food - currentCosts.food) > 300 ? 'High' : 
              Math.abs(targetCosts.food - currentCosts.food) > 150 ? 'Medium' : 'Low'
    },
    { 
      category: 'Transportation', 
      current: currentCosts.transport, 
      target: targetCosts.transport, 
      difference: currentCosts.transport > 0 ? 
        `${targetCosts.transport > currentCosts.transport ? '+' : ''}${Math.round(((targetCosts.transport - currentCosts.transport) / currentCosts.transport) * 100)}%` : 'N/A',
      impact: Math.abs(targetCosts.transport - currentCosts.transport) > 100 ? 'High' : 
              Math.abs(targetCosts.transport - currentCosts.transport) > 50 ? 'Medium' : 'Low'
    },
    { 
      category: 'Healthcare', 
      current: currentCity.other?.healthcare || 0, 
      target: targetCity.other?.healthcare || 0, 
      difference: (currentCity.other?.healthcare || 0) > 0 ? 
        `${(targetCity.other?.healthcare || 0) > (currentCity.other?.healthcare || 0) ? '+' : ''}${Math.round((((targetCity.other?.healthcare || 0) - (currentCity.other?.healthcare || 0)) / (currentCity.other?.healthcare || 1)) * 100)}%` : 'N/A',
      impact: 'High'
    },
    { 
      category: 'Entertainment', 
      current: currentCity.other?.entertainment || 0, 
      target: targetCity.other?.entertainment || 0, 
      difference: (currentCity.other?.entertainment || 0) > 0 ? 
        `${(targetCity.other?.entertainment || 0) > (currentCity.other?.entertainment || 0) ? '+' : ''}${Math.round((((targetCity.other?.entertainment || 0) - (currentCity.other?.entertainment || 0)) / (currentCity.other?.entertainment || 1)) * 100)}%` : 'N/A',
      impact: 'Low'
    },
    { 
      category: 'Utilities', 
      current: currentCosts.utilities, 
      target: targetCosts.utilities, 
      difference: currentCosts.utilities > 0 ? 
        `${targetCosts.utilities > currentCosts.utilities ? '+' : ''}${Math.round(((targetCosts.utilities - currentCosts.utilities) / currentCosts.utilities) * 100)}%` : 'N/A',
      impact: Math.abs(targetCosts.utilities - currentCosts.utilities) > 100 ? 'High' : 
              Math.abs(targetCosts.utilities - currentCosts.utilities) > 50 ? 'Medium' : 'Low'
    }
  ] : [];

  // Calculate summary stats
  const totalCurrentCost = currentCosts?.total || 0;
  const totalTargetCost = targetCosts?.total || 0;
  const totalCurrentInTargetCurrency = currentCosts && targetCosts
    ? currencyService.convert(totalCurrentCost, currentCosts.currency, targetCosts.currency)
    : 0;
  const normalizedAverageIncrease = totalCurrentInTargetCurrency > 0
    ? Math.round(((totalTargetCost - totalCurrentInTargetCurrency) / totalCurrentInTargetCurrency) * 100)
    : 0;
  const extraMonthlyCost = Math.abs(totalTargetCost - totalCurrentInTargetCurrency);
  const costMultiplier = totalCurrentInTargetCurrency > 0 ? (totalTargetCost / totalCurrentInTargetCurrency).toFixed(1) : '0';



  const colors = {
    primary: '#6366f1',
    secondary: '#10b981',
    accent: '#f59e0b',
    danger: '#ef4444',
    success: '#22c55e',
    warning: '#eab308'
  };

  // Show message if no cities selected
  if (!currentCity || !targetCity) {
    return (
      <div className="text-center py-12">
        <div className="text-lg text-muted-foreground">
          Please select both current and target cities to view migration analytics.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Financial Readiness Overview */}
      {salaryBudgetData.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">
                {salaryBudgetData.filter(s => s.canAfford).length > 2 ? '🎉' : 
                 salaryBudgetData.filter(s => s.canAfford).length > 1 ? '👍' : '⚠️'} 
                Affordability Check
              </div>
              <div className="text-lg text-muted-foreground mb-4">
                {salaryBudgetData.filter(s => s.canAfford).length}/{salaryBudgetData.length} salary-to-cost comparisons are affordable
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {salaryBudgetData.map((scenario, index) => (
                  <div key={index} className={`p-3 rounded-lg ${scenario.canAfford ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                    <div className="text-sm font-medium">{scenario.level.replace('\n', ' ')}</div>
                    <div className="text-lg">{scenario.canAfford ? '✅' : '❌'}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 1. Salary vs Budget Reality Check */}
      <Card className="bg-card/60 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-500" />
            Can You Afford This Move?
          </CardTitle>
          <CardDescription>
            Salary vs living costs - see if your budget is realistic
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Debug info to show what data is being used */}
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
              📊 Data Source Analysis
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
              <div>• <strong>Current City:</strong> {currentCity?.name || 'Not selected'} - Monthly costs: {currentCosts ? `${currentCosts.currency} ${Math.round(currentCosts.total).toLocaleString()}` : 'Not available'}</div>
              <div>• <strong>Target City:</strong> {targetCity?.name || 'Not selected'} - Monthly costs: {targetCosts ? `${targetCosts.currency} ${Math.round(targetCosts.total).toLocaleString()}` : 'Not available'}</div>
              <div>• <strong>Cost source:</strong> Numbeo single-person estimate excluding rent + one-bedroom rent outside the city centre</div>
              {(!currentCity || !targetCity) && (
                <div className="text-red-600 dark:text-red-400 font-medium">
                  ⚠️ Please select both cities in the Cost Calculator above to see accurate analysis
                </div>
              )}
            </div>
          </div>
          {salaryBudgetData.length > 0 ? <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryBudgetData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                <XAxis 
                  dataKey="level" 
                  tick={{ fill: '#e2e8f0', fontSize: 14 }} 
                  angle={0}
                  textAnchor="middle"
                  height={60}
                  interval={0}
                />
                <YAxis tick={{ fill: '#e2e8f0', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                  formatter={(value, name, props) => {
                    const currency = props.payload?.currency || 'USD';
                    const symbol = currency === 'INR' ? '₹' : 
                                  currency === 'USD' ? '$' : 
                                  currency === 'CAD' ? 'C$' : 
                                  currency === 'AUD' ? 'A$' : 
                                  currency === 'GBP' ? '£' : '$';
                    
                    const canAfford = props.payload?.canAfford;
                    const affordabilityIcon = canAfford ? '✅' : '❌';
                    
                    return [`${symbol}${value.toLocaleString()} ${name === 'savings' ? affordabilityIcon : ''}`, name];
                  }}
                  labelFormatter={(label) => `📊 ${label}`}
                />
                <Legend />
                <Bar dataKey="monthlySalary" fill={colors.secondary} name="Monthly Salary" />
                <Bar dataKey="livingCosts" fill={colors.danger} name="Living Costs" />
                <Bar dataKey="savings" fill={colors.primary} name="Monthly Savings" />
              </BarChart>
            </ResponsiveContainer>
          </div> : (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              Enter both monthly salaries below to calculate the affordability comparison.
            </div>
          )}
          <div className="mt-6 space-y-4">
            <div className="space-y-4">
              {/* Salary Input Section */}
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                    💰 Enter Your Monthly Salaries
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSalaryInputs(!showSalaryInputs)}
                      className="text-xs"
                    >
                      {showSalaryInputs ? 'Hide' : 'Customize'}
                    </Button>
                    {(customCurrentSalary || customTargetSalary) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          updateCustomCurrentSalary('');
                          updateCustomTargetSalary('');
                        }}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Clear Salary Inputs
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="text-xs text-yellow-600 dark:text-yellow-400 space-y-1 mb-3">
                  <div>• <strong>{currentCity?.name}:</strong> {customCurrentSalary ?
                    `Using your input: ${currentSalaryCurrency} ${parseFloat(customCurrentSalary).toLocaleString()} per month` :
                    'Enter your current monthly salary to run this check'}
                  </div>
                  <div>• <strong>{targetCity?.name}:</strong> {customTargetSalary ?
                    `Using your input: ${targetSalaryCurrency} ${parseFloat(customTargetSalary).toLocaleString()} per month` :
                    'Enter your expected target-city monthly salary to run this check'}
                  </div>
                  <div>• <strong>Salary source:</strong> user-entered monthly salaries</div>
                  <div>• <strong>Formula:</strong> monthly salary − estimated monthly cost = monthly buffer</div>
                </div>

                {showSalaryInputs && (
                  <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-yellow-200 dark:border-yellow-700">
                    <div>
                      <label className="text-xs font-medium text-yellow-700 dark:text-yellow-300 block mb-1">
                        Your {currentCity?.name} Monthly Salary ({currentSalaryCurrency})
                      </label>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        value={customCurrentSalary}
                        onChange={(e) => updateCustomCurrentSalary(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-yellow-700 dark:text-yellow-300 block mb-1">
                        Expected {targetCity?.name} Monthly Salary ({targetSalaryCurrency})
                      </label>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        value={customTargetSalary}
                        onChange={(e) => updateCustomTargetSalary(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-3 bg-muted/40 rounded-lg border text-xs text-muted-foreground">
              Enter both salaries to calculate affordability. No salary benchmark or lifestyle multiplier is used.
            </div>
          </div>
          
          {/* Quick Insights Summary */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {salaryBudgetData.map((scenario, index) => {
              const isAffordable = scenario.canAfford;
              const savingsRate = scenario.monthlySalary > 0 ? (scenario.savings / scenario.monthlySalary * 100) : 0;
              
              return (
                <div key={index} className={`p-4 rounded-lg border-2 ${
                  isAffordable ? 'border-green-200 bg-green-50 dark:bg-green-900/20' : 'border-red-200 bg-red-50 dark:bg-red-900/20'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{isAffordable ? '✅' : '❌'}</span>
                    <span className="font-medium text-sm">{scenario.level.replace('\n', ' ')}</span>
                  </div>
                  <div className="text-xs space-y-1">
                    <div>Savings Rate: <span className={`font-bold ${savingsRate > 20 ? 'text-green-600' : savingsRate > 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {savingsRate.toFixed(1)}%
                    </span></div>
                    <div>Monthly Buffer: <span className={`font-bold ${scenario.savings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {scenario.currency === 'INR' ? '₹' : scenario.currency === 'GBP' ? '£' : '$'}{Math.abs(scenario.savings).toLocaleString()}
                    </span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 2. Migration Budget Calculator */}
      <Card className="bg-card/70 backdrop-blur-md border-border shadow-xl overflow-hidden">
        <CardHeader className="pb-4 border-b border-border/50 bg-muted/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <Calculator className="h-6 w-6 text-primary" />
                One-Time Migration Cost Calculator
              </CardTitle>
              <CardDescription className="mt-1 text-sm">
                Estimate your upfront, non-recurring relocation expenses. Enter custom estimates below or pick a preset.
              </CardDescription>
            </div>
            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium mr-1">Quick Presets:</span>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8 bg-background/50 hover:bg-primary/10 border-primary/20"
                onClick={() => setOneTimeCosts({
                  visa: '15000',
                  languageMedical: '10000',
                  travel: '25000',
                  temporaryStay: '20000',
                  deposit: '30000',
                  setup: '15000'
                })}
              >
                <Sparkles className="h-3.5 w-3.5 mr-1 text-amber-500" />
                Student Move
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8 bg-background/50 hover:bg-primary/10 border-primary/20"
                onClick={() => setOneTimeCosts({
                  visa: '35000',
                  languageMedical: '20000',
                  travel: '60000',
                  temporaryStay: '50000',
                  deposit: '80000',
                  setup: '45000'
                })}
              >
                <Sparkles className="h-3.5 w-3.5 mr-1 text-primary" />
                Work Visa Move
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-8 text-muted-foreground hover:text-foreground"
                onClick={() => setOneTimeCosts({
                  visa: '',
                  languageMedical: '',
                  travel: '',
                  temporaryStay: '',
                  deposit: '',
                  setup: ''
                })}
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Interactive Calculator Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                field: 'visa',
                label: 'Visa & Documents',
                items: 'Visa fees, document translation & legal assistance',
                icon: FileText,
                color: 'text-indigo-400',
                bg: 'bg-indigo-500/10 border-indigo-500/20'
              },
              {
                field: 'languageMedical',
                label: 'Language & Medical',
                items: 'IELTS/PTE exams, medical checks & police clearance',
                icon: Stethoscope,
                color: 'text-rose-400',
                bg: 'bg-rose-500/10 border-rose-500/20'
              },
              {
                field: 'travel',
                label: 'Travel & Moving',
                items: 'Flight tickets, extra baggage & shipping costs',
                icon: Plane,
                color: 'text-sky-400',
                bg: 'bg-sky-500/10 border-sky-500/20'
              },
              {
                field: 'temporaryStay',
                label: 'Temporary Accommodation',
                items: 'Airbnb/Hotel stay for first 1-3 weeks',
                icon: Building,
                color: 'text-amber-400',
                bg: 'bg-amber-500/10 border-amber-500/20'
              },
              {
                field: 'deposit',
                label: 'Housing Security Deposit',
                items: 'Initial bond / advance rent payment',
                icon: Key,
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10 border-emerald-500/20'
              },
              {
                field: 'setup',
                label: 'Initial Household Setup',
                items: 'Essentials, furniture, SIM card & registration',
                icon: Package,
                color: 'text-purple-400',
                bg: 'bg-purple-500/10 border-purple-500/20'
              }
            ].map(({ field, label, items, icon: IconComponent, color, bg }) => {
              const currSymbol = targetCity?.currency === 'USD' ? '$' : targetCity?.currency || 'INR';

              return (
                <div
                  key={field}
                  className="group p-4 rounded-xl bg-card border border-border/80 hover:border-primary/40 transition-all duration-200 shadow-sm hover:shadow-md space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg ${bg} border`}>
                        <IconComponent className={`h-5 w-5 ${color}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm leading-tight text-foreground">{label}</h4>
                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{items}</p>
                      </div>
                    </div>
                  </div>

                  {/* Calculator Input Field */}
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                      {currSymbol === 'INR' ? '₹' : currSymbol}
                    </span>
                    <Input
                      type="number"
                      min="0"
                      value={oneTimeCosts[field]}
                      onChange={(event) => updateOneTimeCost(field, event.target.value)}
                      placeholder="0"
                      className="pl-8 pr-3 text-right font-mono font-bold text-base h-10 bg-background/80 border-border/60 focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Calculator Live Total Header */}
          {(() => {
            const total = migrationBudgetData.reduce((sum, phase) => sum + phase.cost, 0);
            const currSymbol = targetCity?.currency === 'USD' ? '$' : targetCity?.currency || 'INR';
            const displaySymbol = currSymbol === 'INR' ? '₹' : currSymbol;

            return (
              <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-purple-500/10 border border-primary/20 shadow-lg">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5">
                      <Calculator className="h-4 w-4 text-primary" />
                      Total Estimated One-Time Relocation Budget
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Sum of user-entered one-time setup expenses before monthly income kicks in.
                    </p>
                  </div>
                  <div className="text-center sm:text-right">
                    <div className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight font-mono">
                      {displaySymbol} {total.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Progress breakdown bar if total > 0 */}
                {total > 0 && (
                  <div className="mt-5 pt-4 border-t border-border/40">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1.5 font-medium">
                      <span>Expense Distribution</span>
                      <span>{migrationBudgetData.filter(p => p.cost > 0).length} Categories Configured</span>
                    </div>
                    <div className="h-3 w-full bg-muted/50 rounded-full overflow-hidden flex gap-0.5">
                      {migrationBudgetData.map((item, idx) => {
                        const pct = (item.cost / total) * 100;
                        if (pct === 0) return null;
                        const bgColors = [
                          'bg-indigo-500',
                          'bg-rose-500',
                          'bg-sky-500',
                          'bg-amber-500',
                          'bg-emerald-500',
                          'bg-purple-500'
                        ];
                        return (
                          <div
                            key={idx}
                            style={{ width: `${pct}%` }}
                            className={`${bgColors[idx % bgColors.length]} h-full transition-all duration-300`}
                            title={`${item.phase}: ${displaySymbol}${item.cost.toLocaleString()} (${pct.toFixed(1)}%)`}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </CardContent>
      </Card>

      {/* 3. Current vs Target Location Comparison */}
      <Card className="bg-card/60 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            Current vs Target Location
          </CardTitle>
          <CardDescription>
            Key cost differences between {currentCity?.name} and {targetCity?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!hasComparableCategories && (
              <div className="p-3 rounded-lg border border-blue-500/20 bg-blue-500/10 text-xs text-blue-400 flex items-center gap-2">
                <Info className="h-4 w-4 shrink-0 text-blue-400" />
                <span>Comparing overall Numbeo living indices between {currentCity?.name} and {targetCity?.name} converted into target currency ({targetCity?.currency || 'INR'}).</span>
              </div>
            )}
            {locationComparisonData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    {item.category === 'Housing' && <Home className="h-6 w-6 text-primary" />}
                    {item.category === 'Food & Dining' && <Utensils className="h-6 w-6 text-primary" />}
                    {item.category === 'Transportation' && <Car className="h-6 w-6 text-primary" />}
                    {item.category === 'Healthcare' && <Heart className="h-6 w-6 text-primary" />}
                    {item.category === 'Entertainment' && <Users className="h-6 w-6 text-primary" />}
                    {item.category === 'Utilities' && <Zap className="h-6 w-6 text-primary" />}
                  </div>
                  <div>
                    <div className="font-medium">{item.category}</div>
                    <div className="text-sm text-muted-foreground">
                      ${item.current} → ${item.target}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    item.difference.startsWith('+') ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {item.difference}
                  </div>
                  <Badge variant={item.impact === 'High' ? 'destructive' : item.impact === 'Medium' ? 'default' : 'secondary'}>
                    {item.impact} Impact
                  </Badge>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className={`text-2xl font-bold ${normalizedAverageIncrease >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {normalizedAverageIncrease >= 0 ? '+' : ''}{normalizedAverageIncrease}%
                  </div>
                  <div className="text-sm text-red-700 dark:text-red-300">Average Change</div>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {targetCity?.currency === 'USD' ? '$' : 
                     targetCity?.currency === 'INR' ? '₹' : 
                     targetCity?.currency === 'GBP' ? '£' : 
                     targetCity?.currency === 'EUR' ? '€' : 
                     targetCity?.currency === 'CAD' ? 'C$' : 
                     targetCity?.currency === 'AUD' ? 'A$' : '$'}{Math.round(extraMonthlyCost)}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">Monthly Difference</div>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{costMultiplier}x</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">Cost Multiplier</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MigrantAnalytics;