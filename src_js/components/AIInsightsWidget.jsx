import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Lightbulb, 
  TrendingUp, 
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react';
import groqService from '../services/groqService';

const AIInsightsWidget = ({ 
  migrantProfile, 
  costData, 
  comparisonData,
  onInsightGenerated 
}) => {
  const [insights, setInsights] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [insightType, setInsightType] = useState('migration'); // migration, cost, budget

  const generateInsights = async (type = 'migration') => {
    setIsGenerating(true);
    setInsightType(type);
    
    try {
      let result = '';
      
      switch (type) {
        case 'migration':
          result = await groqService.generateMigrationInsights(migrantProfile, costData);
          break;
        case 'cost':
          if (comparisonData) {
            result = await groqService.generateCostInsights(
              comparisonData.city1, 
              comparisonData.city2, 
              migrantProfile
            );
          }
          break;
        case 'budget':
          result = await groqService.generateBudgetOptimization(migrantProfile, costData);
          break;
      }
      
      setInsights(result);
      if (onInsightGenerated) {
        onInsightGenerated(result, type);
      }
    } catch (error) {
      console.error('Error generating insights:', error);
      setInsights('Unable to generate insights at this time. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getInsightIcon = () => {
    switch (insightType) {
      case 'migration': return <Brain className="h-4 w-4" />;
      case 'cost': return <TrendingUp className="h-4 w-4" />;
      case 'budget': return <Lightbulb className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  const getInsightTitle = () => {
    switch (insightType) {
      case 'migration': return 'Migration Insights';
      case 'cost': return 'Cost Comparison Analysis';
      case 'budget': return 'Budget Optimization';
      default: return 'AI Insights';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
          {getInsightIcon()}
          AI-Powered {getInsightTitle()}
        </CardTitle>
        <CardDescription>
          Get personalized insights powered by advanced AI analysis
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Insight Type Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={insightType === 'migration' ? 'default' : 'outline'}
            size="sm"
            onClick={() => generateInsights('migration')}
            disabled={isGenerating}
            className="text-xs"
          >
            <Brain className="h-3 w-3 mr-1" />
            Migration Tips
          </Button>
          
          {comparisonData && (
            <Button
              variant={insightType === 'cost' ? 'default' : 'outline'}
              size="sm"
              onClick={() => generateInsights('cost')}
              disabled={isGenerating}
              className="text-xs"
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              Cost Analysis
            </Button>
          )}
          
          <Button
            variant={insightType === 'budget' ? 'default' : 'outline'}
            size="sm"
            onClick={() => generateInsights('budget')}
            disabled={isGenerating}
            className="text-xs"
          >
            <Lightbulb className="h-3 w-3 mr-1" />
            Budget Tips
          </Button>
        </div>

        {/* Insights Display */}
        <div className="min-h-[120px] p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-purple-200 dark:border-purple-700">
          {isGenerating ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
              <span className="ml-2 text-sm text-purple-600">Generating insights...</span>
            </div>
          ) : insights ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  AI Generated
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {getInsightTitle()}
                </Badge>
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {insights}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span className="text-sm">Click a button above to generate AI insights</span>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {insights && !isGenerating && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigator.clipboard.writeText(insights)}
              className="text-xs"
            >
              Copy Insights
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => generateInsights(insightType)}
              className="text-xs"
            >
              Regenerate
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsightsWidget;