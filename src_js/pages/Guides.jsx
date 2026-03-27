import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Footer } from "@/components/Footer";
import {
  MapPin, 
  Star, 
  DollarSign, 
  Video, 
  MessageCircle, 
  Filter,
  Search,
  Calendar,
  Globe,
  Award,
  Users,
  Clock,
  ExternalLink,
  Phone
} from "lucide-react";
import apiService from "../services/api";
import { useApiData } from "../hooks/useApi";
import { useAuth } from "../contexts/AuthContext";

const Guides = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Fetch real guide data from database
  const { data: guides = [], loading: guidesLoading, error: guidesError } = useApiData(
    () => apiService.searchGuides(),
    []
  );

  // State for scheduled calls
  const [scheduledCalls, setScheduledCalls] = useState([]);
  const [callsLoading, setCallsLoading] = useState(false);

  // Remove mock data - use only real guides from database
  const mockGuides = [
    {
      _id: "guide1",
      userId: "user1",
      fullName: "Priya Sharma",
      residenceCountry: "Canada",
      targetCountries: ["Canada"],
      specialization: "Tech Immigration",
      expertiseAreas: ["Express Entry", "Job Search"],
      rating: 4.9,
      totalReviews: 127,
      hourlyRate: 50,
      languages: ["English", "Hindi"],
      yearsExperience: "5+ years",
      availability: "Available",
      verifiedStatus: "verified",
      avatar: "PS"
    },
    {
      _id: "guide2", 
      userId: "user2",
      fullName: "Rahul Mehta",
      residenceCountry: "Germany",
      targetCountries: ["Germany"],
      specialization: "EU Blue Card",
      expertiseAreas: ["German Language", "Startup Visa"],
      rating: 4.8,
      totalReviews: 203,
      hourlyRate: 45,
      languages: ["English", "German", "Hindi"],
      yearsExperience: "7+ years",
      availability: "Available",
      verifiedStatus: "verified",
      avatar: "RM"
    }
  ];

  // Use only real guides from database, with fallback to empty array
  const displayGuides = guides || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [sortBy, setSortBy] = useState("rating");

  // Fetch scheduled calls for the current user
  useEffect(() => {
    const fetchScheduledCalls = async () => {
      if (!currentUser?._id) return;

      try {
        setCallsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_AUTH_BASE_URL || 'http://localhost:5000'}/api/scheduled-calls?migrantId=${currentUser._id}`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const callsData = await response.json();
          setScheduledCalls(callsData);
          console.log('✅ Scheduled calls fetched:', callsData.length);
        }
      } catch (err) {
        console.error('❌ Error fetching scheduled calls:', err);
      } finally {
        setCallsLoading(false);
      }
    };

    fetchScheduledCalls();
  }, [currentUser]);

  const countries = ["All", "Canada", "Germany", "Australia", "United Kingdom"];

  const filteredGuides = (displayGuides || [])
    .filter(guide => 
      (selectedCountry === "All" || guide.residenceCountry === selectedCountry) &&
      (guide.fullName && guide.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       guide.specialization && guide.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
       (guide.expertiseAreas && guide.expertiseAreas.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "price":
          return (a.hourlyRate || 0) - (b.hourlyRate || 0);
        case "reviews":
          return (b.totalReviews || 0) - (a.totalReviews || 0);
        default:
          return 0;
      }
    });

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case "Available":
        return "text-green-500 bg-green-100 dark:bg-green-900/20";
      case "Busy":
        return "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20";
      case "Offline":
        return "text-red-500 bg-red-100 dark:bg-red-900/20";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur-lg sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold">Find Your Guide</h1>
              <p className="text-muted-foreground">Connect with verified migration experts from around the world</p>
            </div>
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search guides by name or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="price">Lowest Price</option>
                  <option value="reviews">Most Reviews</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{(displayGuides || []).length}+</div>
              <div className="text-sm text-muted-foreground">Verified Guides</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Globe className="w-8 h-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold text-secondary">{new Set((displayGuides || []).map(g => g.residenceCountry)).size}+</div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Award className="w-8 h-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-accent">94%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-500">
                {(displayGuides || []).length > 0 ? ((displayGuides || []).reduce((sum, g) => sum + (g.rating || 0), 0) / (displayGuides || []).length).toFixed(1) : '4.8'}
              </div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </CardContent>
          </Card>
        </div>
        {/* Loading State */}
        {guidesLoading && (
          <div className="text-center py-12">
            <div className="text-muted-foreground">Loading guides...</div>
          </div>
        )}

        {/* Error State */}
        {guidesError && (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">Error loading guides: {guidesError}</div>
            <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
              Retry
            </Button>
          </div>
        )}

        {/* Guides Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <Card key={guide._id || guide.userId} className="hover:shadow-glow transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                        {guide.avatar || guide.fullName?.split(' ').map(n => n[0]).join('') || 'G'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{guide.fullName || 'Guide Name'}</h3>
                        {guide.verifiedStatus === 'verified' && (
                          <Badge className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3 mr-1" />
                        {guide.residenceCountry || 'Location'}
                      </div>
                    </div>
                  </div>
                  <Badge className={`text-xs ${getAvailabilityColor(guide.availability || 'Available')}`}>
                    {guide.availability || 'Available'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Specializations */}
                <div>
                  <div className="text-sm font-medium mb-2">Specializations:</div>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">
                      {guide.specialization || 'General'}
                    </Badge>
                    {guide.expertiseAreas?.map((spec, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{guide.rating || '4.5'}</span>
                    <span className="text-muted-foreground">({guide.totalReviews || 0})</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Award className="w-4 h-4 text-green-500" />
                    <span className="font-medium">{guide.yearsExperience || '5+ years'}</span>
                    <span className="text-muted-foreground">exp</span>
                  </div>
                </div>
                {/* Languages & Experience */}
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Languages: </span>
                    <span>{guide.languages?.join(", ") || 'English'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Experience: </span>
                    <span>{guide.yearsExperience || '5+ years'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Response: </span>
                    <span>&lt; 2 hours</span>
                  </div>
                </div>
                {/* Price & Actions */}
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4 text-accent" />
                      <span className="text-lg font-bold text-accent">
                        ${guide.hourlyRate || 50} USD
                      </span>
                      <span className="text-sm text-muted-foreground">/session</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="hero" 
                      className="flex-1 group-hover:shadow-glow"
                      onClick={() => navigate('/call-request', { 
                        state: { 
                          guideData: {
                            id: guide._id || guide.userId,
                            name: guide.fullName,
                            location: guide.residenceCountry,
                            specialization: guide.specialization,
                            rating: guide.rating,
                            reviews: guide.totalReviews,
                            price: `$${guide.hourlyRate || 50} USD`,
                            responseTime: '< 2 hours',
                            specializations: [guide.specialization, ...(guide.expertiseAreas || [])]
                          }
                        }
                      })}
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Book Call
                    </Button>
                    <Button variant="outline" size="icon">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {filteredGuides.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No guides found matching your criteria.</p>
          </div>
        )}

        {/* Scheduled Calls Section */}
        {currentUser && (
          <div className="mt-16 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Your Scheduled Calls
                </CardTitle>
                <CardDescription>
                  Upcoming calls with your guides
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Debug Info */}
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="text-sm text-yellow-700 dark:text-yellow-300">
                    <strong>Debug Info:</strong><br/>
                    • User logged in: {currentUser ? '✅ Yes' : '❌ No'}<br/>
                    • User ID: {currentUser?._id || 'None'}<br/>
                    • Scheduled calls: {scheduledCalls.length}<br/>
                    • Loading calls: {callsLoading ? 'Yes' : 'No'}
                  </div>
                </div>

                <div className="space-y-4">
                  {scheduledCalls.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-muted-foreground mb-4">
                        No scheduled calls yet
                      </div>
                      <p className="text-sm text-muted-foreground">
                        When guides schedule calls with you, they'll appear here
                      </p>
                    </div>
                  ) : (
                    scheduledCalls.map((call) => (
                    <div key={call._id} className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                                {call.guideName?.split(' ').map(n => n[0]).join('') || 'G'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-lg">{call.guideName}</h3>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {new Date(call.scheduledDate).toLocaleDateString('en-US', { 
                                    weekday: 'short', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })} at {call.scheduledTime}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span><strong>Duration:</strong> {call.duration} minutes</span>
                            </div>
                            {call.meetingLink && (
                              <div className="flex items-center gap-2">
                                <Video className="h-4 w-4" />
                                <span><strong>Meeting:</strong> Google Meet</span>
                              </div>
                            )}
                            {call.notes && (
                              <div className="flex items-start gap-2 md:col-span-2">
                                <MessageCircle className="h-4 w-4 mt-0.5" />
                                <span><strong>Notes:</strong> {call.notes}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-3 text-xs text-muted-foreground">
                            Scheduled on {new Date(call.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          {call.meetingLink && (
                            <Button size="sm" asChild className="bg-green-600 hover:bg-green-700">
                              <a href={call.meetingLink} target="_blank" rel="noopener noreferrer">
                                <Video className="h-4 w-4 mr-1" />
                                Join Call
                              </a>
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Phone className="h-4 w-4 mr-1" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    </div>
                  )))}
                </div>
                
                {/* Quick Stats */}
                <div className="mt-6 pt-4 border-t border-border">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{scheduledCalls.length}</div>
                      <div className="text-sm text-green-700 dark:text-green-300">Scheduled</div>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {scheduledCalls.filter(call => new Date(call.scheduledDate) >= new Date()).length}
                      </div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">Upcoming</div>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {new Set(scheduledCalls.map(call => call.guideId)).size}
                      </div>
                      <div className="text-sm text-purple-700 dark:text-purple-300">Guides</div>
                    </div>
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {scheduledCalls.reduce((total, call) => total + call.duration, 0)}
                      </div>
                      <div className="text-sm text-orange-700 dark:text-orange-300">Total Minutes</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
};

export default Guides;
