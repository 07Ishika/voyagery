import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Star, 
  MapPin, 
  Clock, 
  DollarSign,
  Brain,
  Loader2,
  MessageCircle,
  Calendar
} from 'lucide-react';
import groqService from '../services/groqService';

const SmartGuideRecommendations = ({ 
  migrantProfile, 
  availableGuides,
  onGuideSelect,
  onBookSession 
}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);

  const analyzeGuides = async () => {
    if (!migrantProfile || !availableGuides?.length) return;
    
    setIsAnalyzing(true);
    try {
      const result = await groqService.findBestGuides(migrantProfile, availableGuides);
      setRecommendations(result.recommendations || []);
    } catch (error) {
      console.error('Error analyzing guides:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    analyzeGuides();
  }, [migrantProfile, availableGuides]);

  const getMatchScoreColor = (score) => {
    if (score >= 8) return 'bg-green-500';
    if (score >= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getGuideById = (guideId) => {
    return availableGuides.find(guide => guide.id === guideId);
  };

  if (isAnalyzing) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2">
              AI Analyzing Guides
            </h3>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Finding the perfect matches for your migration needs...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Brain className="h-5 w-5" />
            AI-Recommended Guides
          </CardTitle>
          <CardDescription>
            Personalized guide recommendations based on your migration profile
          </CardDescription>
        </CardHeader>
      </Card>

      {recommendations.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No recommendations available. Please update your profile or try again.
            </p>
            <Button 
              variant="outline" 
              onClick={analyzeGuides}
              className="mt-4"
            >
              Retry Analysis
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {recommendations.map((rec, index) => {
            const guide = getGuideById(rec.guideId);
            if (!guide) return null;

            return (
              <Card 
                key={rec.guideId}
                className={`transition-all duration-200 hover:shadow-lg ${
                  index === 0 ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Guide Avatar */}
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={guide.avatar} alt={guide.name} />
                      <AvatarFallback className="text-lg font-semibold">
                        {guide.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>

                    {/* Guide Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold">{guide.name}</h3>
                            {index === 0 && (
                              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                Best Match
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{guide.rating}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{guide.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              <span>${guide.hourlyRate}/hr</span>
                            </div>
                          </div>
                        </div>

                        {/* Match Score */}
                        <div className="text-center">
                          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full text-white font-bold ${getMatchScoreColor(rec.matchScore)}`}>
                            {rec.matchScore}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Match Score</p>
                        </div>
                      </div>

                      {/* Specializations */}
                      <div className="flex flex-wrap gap-1">
                        {guide.specializations.map(spec => (
                          <Badge key={spec} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>

                      {/* AI Reasons */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                          Why this guide is recommended:
                        </h4>
                        <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                          {rec.reasons.map((reason, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-blue-400 mt-1">•</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Estimated Cost & Timeline */}
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <DollarSign className="h-4 w-4" />
                          <span>Est. Cost: {rec.estimatedCost}</span>
                        </div>
                        <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                          <Clock className="h-4 w-4" />
                          <span>Timeline: {rec.timeline}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() => onGuideSelect && onGuideSelect(guide)}
                          className="flex-1"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Contact Guide
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => onBookSession && onBookSession(guide)}
                          className="flex-1"
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Book Session
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Refresh Button */}
      <div className="text-center">
        <Button 
          variant="ghost" 
          onClick={analyzeGuides}
          disabled={isAnalyzing}
          className="text-sm"
        >
          <Brain className="h-4 w-4 mr-2" />
          Refresh Recommendations
        </Button>
      </div>
    </div>
  );
};

export default SmartGuideRecommendations;