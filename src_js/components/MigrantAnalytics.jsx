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
  Zap
} from 'lucide-react';

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
  // Calculate actual costs from the selected cities
  const currentCosts = currentCity ? {
    housing: currentCity.rent?.oneBedroom || 0,
    food: (currentCity.food?.groceries || 0) + (currentCity.food?.restaurant || 0),
    transport: currentCity.transport?.public || 0,
    utilities: (currentCity.utilities?.electricity || 0) + (currentCity.utilities?.water || 0) + 
               (currentCity.utilities?.internet || 0) + (currentCity.utilities?.phone || 0),
    total: 0
  } : null;

  const targetCosts = targetCity ? {
    housing: targetCity.rent?.oneBedroom || 0,
    food: (targetCity.food?.groceries || 0) + (targetCity.food?.restaurant || 0),
    transport: targetCity.transport?.public || 0,
    utilities: (targetCity.utilities?.electricity || 0) + (targetCity.utilities?.water || 0) + 
               (targetCity.utilities?.internet || 0) + (targetCity.utilities?.phone || 0),
    total: 0
  } : null;

  // Calculate totals
  if (currentCosts) {
    currentCosts.total = currentCosts.housing + currentCosts.food + currentCosts.transport + currentCosts.utilities;
  }
  if (targetCosts) {
    targetCosts.total = targetCosts.housing + targetCosts.food + targetCosts.transport + targetCosts.utilities;
  }

  // Salary estimates based on research (2024 data)
  // Sources: Glassdoor, PayScale, Numbeo, government statistics
  const salaryData = {
    'Mumbai': { avg: 800000, min: 400000, max: 1500000, currency: 'INR' }, // IT/Finance avg
    'Delhi': { avg: 750000, min: 350000, max: 1400000, currency: 'INR' },
    'Toronto': { avg: 75000, min: 45000, max: 120000, currency: 'CAD' }, // Mid-level professional
    'Vancouver': { avg: 72000, min: 42000, max: 115000, currency: 'CAD' },
    'New York': { avg: 95000, min: 55000, max: 160000, currency: 'USD' },
    'San Francisco': { avg: 120000, min: 70000, max: 200000, currency: 'USD' },
    'London': { avg: 50000, min: 30000, max: 80000, currency: 'GBP' },
    'Sydney': { avg: 85000, min: 50000, max: 130000, currency: 'AUD' }
  };

  const currentSalaryInfo = salaryData[currentCity?.name] || { avg: 50000, currency: 'USD' };
  const targetSalaryInfo = salaryData[targetCity?.name] || { avg: 60000, currency: 'USD' };

  // Use custom salary if provided, otherwise use estimates
  const currentMonthlySalary = customCurrentSalary ? 
    parseFloat(customCurrentSalary) : currentSalaryInfo.avg / 12;
  const targetMonthlySalary = customTargetSalary ? 
    parseFloat(customTargetSalary) : targetSalaryInfo.avg / 12;

  // Salary vs Budget Reality Check (using realistic salary data)
  const salaryBudgetData = currentCosts && targetCosts ? [
    {
      level: `Current\n${currentCity.name}`,
      monthlySalary: Math.round(currentMonthlySalary),
      livingCosts: Math.round(currentCosts.total),
      savings: Math.round(currentMonthlySalary - currentCosts.total),
      canAfford: currentMonthlySalary > currentCosts.total,
      currency: currentCity.currency
    },
    {
      level: `${targetCity.name}\nConservative`,
      monthlySalary: Math.round(targetMonthlySalary),
      livingCosts: Math.round(targetCosts.total * 0.8),
      savings: Math.round(targetMonthlySalary - (targetCosts.total * 0.8)),
      canAfford: targetMonthlySalary > (targetCosts.total * 0.8),
      currency: targetCity.currency
    },
    {
      level: `${targetCity.name}\nRealistic`,
      monthlySalary: Math.round(targetMonthlySalary),
      livingCosts: Math.round(targetCosts.total),
      savings: Math.round(targetMonthlySalary - targetCosts.total),
      canAfford: targetMonthlySalary > targetCosts.total,
      currency: targetCity.currency
    },
    {
      level: `${targetCity.name}\nPremium`,
      monthlySalary: Math.round(targetMonthlySalary),
      livingCosts: Math.round(targetCosts.total * 1.3),
      savings: Math.round(targetMonthlySalary - (targetCosts.total * 1.3)),
      canAfford: targetMonthlySalary > (targetCosts.total * 1.3),
      currency: targetCity.currency
    }
  ] : [];

  // Migration Budget Planning (based on target location)
  const baseMigrationCost = targetCosts ? targetCosts.total * 0.5 : 2000; // Base cost as % of monthly living cost
  
  const migrationBudgetData = [
    { 
      phase: 'Planning & Research', 
      cost: Math.round(baseMigrationCost * 0.15), 
      timeframe: 'Months 1-2',
      items: ['Language tests', 'Document preparation', 'Research costs']
    },
    { 
      phase: 'Visa & Documentation', 
      cost: Math.round(baseMigrationCost * 0.35), 
      timeframe: 'Months 2-4',
      items: ['Visa fees', 'Medical exams', 'Legal assistance']
    },
    { 
      phase: 'Travel & Moving', 
      cost: Math.round(baseMigrationCost * 0.25), 
      timeframe: 'Month 5-6',
      items: ['Flight tickets', 'Shipping', 'Temporary accommodation']
    },
    { 
      phase: 'Initial Setup', 
      cost: Math.round(baseMigrationCost * 0.25), 
      timeframe: 'First 3 months',
      items: ['Security deposits', 'Furniture', 'Local registration']
    }
  ];

  // Current vs Target Location Comparison (using actual data)
  const locationComparisonData = currentCosts && targetCosts ? [
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
  const averageIncrease = totalCurrentCost > 0 ? Math.round(((totalTargetCost - totalCurrentCost) / totalCurrentCost) * 100) : 0;
  const extraMonthlyCost = Math.abs(totalTargetCost - totalCurrentCost);
  const costMultiplier = totalCurrentCost > 0 ? (totalTargetCost / totalCurrentCost).toFixed(1) : '0';



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
                Financial Readiness Score
              </div>
              <div className="text-lg text-muted-foreground mb-4">
                {salaryBudgetData.filter(s => s.canAfford).length}/4 scenarios are financially viable
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
              <div>• <strong>Current City:</strong> {currentCity?.name || 'Not selected'} - Monthly costs: ${Math.round(currentCosts?.total || 0)}</div>
              <div>• <strong>Target City:</strong> {targetCity?.name || 'Not selected'} - Monthly costs: ${Math.round(targetCosts?.total || 0)}</div>
              <div>• <strong>Breakdown:</strong> Housing + Food + Transport + Utilities from city database</div>
              {(!currentCity || !targetCity) && (
                <div className="text-red-600 dark:text-red-400 font-medium">
                  ⚠️ Please select both cities in the Cost Calculator above to see accurate analysis
                </div>
              )}
            </div>
          </div>
          <div className="h-96">
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
          </div>
          <div className="mt-6 space-y-4">
            <div className="space-y-4">
              {/* Salary Input Section */}
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                    📊 Salary Estimates vs Your Reality
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
                        Reset to Estimates
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="text-xs text-yellow-600 dark:text-yellow-400 space-y-1 mb-3">
                  <div>• <strong>{currentCity?.name}:</strong> {customCurrentSalary ? 
                    `Using YOUR custom salary: ${currentSalaryInfo.currency} ${(parseFloat(customCurrentSalary) * 12).toLocaleString()}/year (Monthly: ${parseFloat(customCurrentSalary).toLocaleString()})` : 
                    `Using estimate of ${currentSalaryInfo.currency} ${currentSalaryInfo.avg.toLocaleString()}/year (Monthly: ${Math.round(currentSalaryInfo.avg/12).toLocaleString()})`}
                  </div>
                  <div>• <strong>{targetCity?.name}:</strong> {customTargetSalary ? 
                    `Using YOUR custom salary: ${targetSalaryInfo.currency} ${(parseFloat(customTargetSalary) * 12).toLocaleString()}/year (Monthly: ${parseFloat(customTargetSalary).toLocaleString()})` : 
                    `Using estimate of ${targetSalaryInfo.currency} ${targetSalaryInfo.avg.toLocaleString()}/year (Monthly: ${Math.round(targetSalaryInfo.avg/12).toLocaleString()})`}
                  </div>
                  <div>• <strong>Storage Key:</strong> {storageKey}</div>
                  <div>• <strong>Sources:</strong> {customCurrentSalary || customTargetSalary ? 'Your custom inputs + ' : ''}Glassdoor, PayScale, Numbeo (2024 data)</div>
                </div>

                {showSalaryInputs && (
                  <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-yellow-200 dark:border-yellow-700">
                    <div>
                      <label className="text-xs font-medium text-yellow-700 dark:text-yellow-300 block mb-1">
                        Your {currentCity?.name} Monthly Salary ({currentSalaryInfo.currency})
                      </label>
                      <Input
                        type="number"
                        placeholder={Math.round(currentSalaryInfo.avg / 12).toString()}
                        value={customCurrentSalary}
                        onChange={(e) => updateCustomCurrentSalary(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-yellow-700 dark:text-yellow-300 block mb-1">
                        Expected {targetCity?.name} Monthly Salary ({targetSalaryInfo.currency})
                      </label>
                      <Input
                        type="number"
                        placeholder={Math.round(targetSalaryInfo.avg / 12).toString()}
                        value={customTargetSalary}
                        onChange={(e) => updateCustomTargetSalary(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-sm font-medium text-green-700 dark:text-green-300">💰 Conservative (80%)</div>
                <div className="text-xs text-green-600 dark:text-green-400">Shared housing, cook at home, basic lifestyle</div>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-sm font-medium text-blue-700 dark:text-blue-300">🏠 Realistic (100%)</div>
                <div className="text-xs text-blue-600 dark:text-blue-400">1BR apartment, normal lifestyle, mix of cooking/eating out</div>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-sm font-medium text-orange-700 dark:text-orange-300">✨ Premium (130%)</div>
                <div className="text-xs text-orange-600 dark:text-orange-400">Nice apartment, frequent dining, comfortable living</div>
              </div>
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

      {/* 2. Migration Budget Planning */}
      <Card className="bg-card/60 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            Migration Budget Planning
          </CardTitle>
          <CardDescription>
            Total costs and timeline for your migration journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {migrationBudgetData.map((phase, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{phase.phase}</div>
                      <div className="text-sm text-muted-foreground">{phase.timeframe}</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground ml-11">
                    {phase.items.join(' • ')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">${phase.cost}</div>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Migration Budget:</span>
                <span className="text-3xl font-bold text-primary">
                  ${migrationBudgetData.reduce((sum, phase) => sum + phase.cost, 0).toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Spread over 6-9 months • Save ${Math.round(migrationBudgetData.reduce((sum, phase) => sum + phase.cost, 0) / 6)}/month
              </div>
            </div>
          </div>
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
            Key cost differences between Mumbai and Toronto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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
                  <div className={`text-2xl font-bold ${averageIncrease >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {averageIncrease >= 0 ? '+' : ''}{averageIncrease}%
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