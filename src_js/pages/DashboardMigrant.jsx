import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { Calendar, Clock, Video, Phone, User, ExternalLink } from 'lucide-react';

const DashboardMigrant = () => {
  const { currentUser, loading: userLoading } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [scheduledCalls, setScheduledCalls] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch migrant's sessions and scheduled calls
  useEffect(() => {
    const fetchMigrantData = async () => {
      if (!currentUser?._id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Fetching migrant data for user:', currentUser._id);
        
        // Fetch sessions
        const sessionsResponse = await fetch(`${import.meta.env.VITE_AUTH_BASE_URL || 'http://localhost:5000'}/api/guide-sessions?migrantId=${currentUser._id}`, {
          credentials: 'include'
        });
        
        if (sessionsResponse.ok) {
          const sessionsData = await sessionsResponse.json();
          setSessions(sessionsData);
          console.log('✅ Sessions fetched:', sessionsData.length);
        }

        // Fetch scheduled calls
        const callsResponse = await fetch(`${import.meta.env.VITE_AUTH_BASE_URL || 'http://localhost:5000'}/api/scheduled-calls?migrantId=${currentUser._id}`, {
          credentials: 'include'
        });
        
        if (callsResponse.ok) {
          const callsData = await callsResponse.json();
          setScheduledCalls(callsData);
          console.log('✅ Scheduled calls fetched:', callsData.length);
        }

        // Fetch notifications
        const notificationsResponse = await fetch(`${import.meta.env.VITE_AUTH_BASE_URL || 'http://localhost:5000'}/api/notifications/${currentUser._id}`, {
          credentials: 'include'
        });
        
        if (notificationsResponse.ok) {
          const notificationsData = await notificationsResponse.json();
          setNotifications(notificationsData.slice(0, 5)); // Show latest 5
          console.log('✅ Notifications fetched:', notificationsData.length);
        }
        
      } catch (err) {
        console.error('❌ Error fetching migrant data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && !userLoading) {
      fetchMigrantData();
    }
  }, [currentUser, userLoading]);

  // Show loading while user data is being fetched
  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error if user is not authenticated
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground mb-4">Please log in to access the dashboard.</p>
          <button 
            onClick={() => window.location.href = '/manual-login'}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Show loading while fetching data
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Migrant Dashboard</h1>
          <p className="text-muted-foreground">
            {currentUser.displayName} • {currentUser.email} • Migrant
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sessions.length}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {sessions.filter(s => s.requestStatus === 'pending').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting response</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Accepted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {sessions.filter(s => s.requestStatus === 'accepted').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Ready to schedule</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Scheduled Calls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {scheduledCalls.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Upcoming</p>
            </CardContent>
          </Card>
        </div>

        {/* Scheduled Calls Section */}
        {scheduledCalls.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-blue-500" />
                Scheduled Calls
              </CardTitle>
              <CardDescription>
                Your upcoming calls with guides
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledCalls.map((call) => (
                  <div key={call._id} className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{call.guideName}</h3>
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(call.scheduledDate).toLocaleDateString()} at {call.scheduledTime}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span><strong>Duration:</strong> {call.duration} minutes</span>
                          </div>
                          {call.meetingLink && (
                            <div className="flex items-center gap-2">
                              <Video className="h-4 w-4" />
                              <span><strong>Meeting Link:</strong> 
                                <a href={call.meetingLink} target="_blank" rel="noopener noreferrer" 
                                   className="text-blue-600 hover:underline ml-1 inline-flex items-center gap-1">
                                  Join Call <ExternalLink className="h-3 w-3" />
                                </a>
                              </span>
                            </div>
                          )}
                          {call.notes && (
                            <div className="flex items-start gap-2">
                              <User className="h-4 w-4 mt-0.5" />
                              <span><strong>Notes:</strong> {call.notes}</span>
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            Scheduled on {new Date(call.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        {call.meetingLink && (
                          <Button size="sm" asChild>
                            <a href={call.meetingLink} target="_blank" rel="noopener noreferrer">
                              <Video className="h-4 w-4 mr-1" />
                              Join Call
                            </a>
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4 mr-1" />
                          Contact Guide
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Your Session Requests */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Session Requests</CardTitle>
            <CardDescription>
              Track the status of your guide session requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground mb-4">
                  No session requests yet
                </div>
                <p className="text-sm text-muted-foreground">
                  Start by requesting a session with a guide
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session._id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">
                            {session.guideName || 'Guide'}
                          </h3>
                          <Badge variant={
                            session.requestStatus === 'pending' ? 'default' :
                            session.requestStatus === 'accepted' ? 'success' : 'destructive'
                          }>
                            {session.requestStatus || 'pending'}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p><strong>Purpose:</strong> {session.purpose || 'General consultation'}</p>
                          <p><strong>Budget:</strong> {session.budget || 'Not specified'}</p>
                          <p><strong>Timeline:</strong> {session.timeline || 'Not specified'}</p>
                          <p><strong>Requested:</strong> {new Date(session.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        {session.requestStatus === 'accepted' && (
                          <Badge variant="success" className="bg-green-100 text-green-800">
                            ✅ Accepted - Waiting for schedule
                          </Badge>
                        )}
                        {session.requestStatus === 'pending' && (
                          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                            ⏳ Pending Response
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        {notifications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>
                Latest updates and messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div key={notification._id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="text-2xl">
                      {notification.type === 'call_scheduled' ? '📅' : 
                       notification.type === 'session_accepted' ? '✅' : '📢'}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{notification.title}</div>
                      <div className="text-sm text-muted-foreground">{notification.message}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardMigrant;


