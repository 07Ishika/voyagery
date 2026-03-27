import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../contexts/AuthContext";

const DashboardGuide = () => {
  const { currentUser, loading: userLoading, isGuide } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({
    date: '',
    time: '',
    duration: '30',
    meetLink: '',
    notes: ''
  });

  // Debug user authentication
  useEffect(() => {
    console.log('🔍 Dashboard Debug:', {
      currentUser,
      userLoading,
      isAuthenticated: !!currentUser,
      isGuide
    });
  }, [currentUser, userLoading, isGuide]);

  // Simple data fetching without complex hooks
  useEffect(() => {
    const fetchSessions = async () => {
      if (!currentUser?._id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Fetching sessions for user:', currentUser._id);
        console.log('🔍 Current user object:', currentUser);
        
        // Try fetching by guideId first
        const response = await fetch(`${import.meta.env.VITE_AUTH_BASE_URL || 'http://localhost:5000'}/api/guide-sessions?guideId=${currentUser._id}`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        let data = await response.json();
        console.log('✅ Sessions fetched by guideId:', data);
        console.log('✅ Number of sessions found by guideId:', data.length);
        
        // If no sessions found by guideId, try by guideName as fallback
        if (data.length === 0) {
          console.log('🔄 No sessions found by guideId, trying by guideName...');
          const nameResponse = await fetch(`${import.meta.env.VITE_AUTH_BASE_URL || 'http://localhost:5000'}/api/guide-sessions?guideName=${encodeURIComponent(currentUser.displayName)}`, {
            credentials: 'include'
          });
          
          if (nameResponse.ok) {
            data = await nameResponse.json();
            console.log('✅ Sessions found by guideName:', data.length);
          }
        }
        
        // Also fetch ALL sessions to debug
        const allSessionsResponse = await fetch(`${import.meta.env.VITE_AUTH_BASE_URL || 'http://localhost:5000'}/api/guide-sessions`, {
          credentials: 'include'
        });
        const allSessions = await allSessionsResponse.json();
        console.log('🔍 ALL sessions in database:', allSessions);
        console.log('🔍 Looking for guideId:', currentUser._id);
        console.log('🔍 Looking for guideName:', currentUser.displayName);
        
        setSessions(data || []);
        
      } catch (err) {
        console.error('❌ Error fetching sessions:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && !userLoading) {
      fetchSessions();
    }
  }, [currentUser, userLoading]);

  // Real-time polling for new session requests
  useEffect(() => {
    if (!currentUser?._id) return;

    const pollForUpdates = setInterval(() => {
      console.log('🔄 Polling for new session requests...');
      // Re-fetch sessions every 10 seconds
      const fetchUpdatedSessions = async () => {
        try {
          // Try by guideId first
          let response = await fetch(`${import.meta.env.VITE_AUTH_BASE_URL || 'http://localhost:5000'}/api/guide-sessions?guideId=${currentUser._id}`, {
            credentials: 'include'
          });
          
          if (response.ok) {
            let data = await response.json();
            
            // If no sessions found by guideId, try by guideName
            if (data.length === 0) {
              response = await fetch(`${import.meta.env.VITE_AUTH_BASE_URL || 'http://localhost:5000'}/api/guide-sessions?guideName=${encodeURIComponent(currentUser.displayName)}`, {
                credentials: 'include'
              });
              
              if (response.ok) {
                data = await response.json();
              }
            }
            
            setSessions(data || []);
          }
        } catch (err) {
          console.error('❌ Error polling sessions:', err);
        }
      };
      
      fetchUpdatedSessions();
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(pollForUpdates);
  }, [currentUser?._id]);

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

  // Show error state if there's an API error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Dashboard Error</h2>
          <p className="text-muted-foreground mb-6">
            Failed to load dashboard data: {error}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while fetching sessions
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading sessions...</p>
        </div>
      </div>
    );
  }



  // Handle session accept/decline actions
  const handleSessionAction = async (sessionId, requestStatus) => {
    try {
      setUpdating(true);
      
      if (requestStatus === 'declined') {
        // Confirm before deleting
        const sessionToDelete = sessions.find(s => s._id === sessionId);
        const migrantName = sessionToDelete?.migrantName || 'the migrant';
        
        const confirmed = window.confirm(
          `Are you sure you want to decline the request from ${migrantName}?`
        );
        
        if (!confirmed) {
          setUpdating(false);
          return;
        }
        
        // DELETE the session from database when declined
        const response = await fetch(`${import.meta.env.VITE_AUTH_BASE_URL || 'http://localhost:5000'}/api/guide-sessions/${sessionId}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        // Remove the session from local state
        setSessions(prevSessions => 
          prevSessions.filter(session => session._id !== sessionId)
        );
        
        alert(`Request declined and removed.`);
        
      } else if (requestStatus === 'accepted') {
        // UPDATE the session when accepted
        const updateData = {
          requestStatus: 'accepted',
          status: 'active',
          updatedAt: new Date().toISOString()
        };
        
        const response = await fetch(`${import.meta.env.VITE_AUTH_BASE_URL || 'http://localhost:5000'}/api/guide-sessions/${sessionId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(updateData),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        // Update the local sessions state
        setSessions(prevSessions => 
          prevSessions.map(session => 
            session._id === sessionId 
              ? { ...session, ...updateData }
              : session
          )
        );
        
        alert(`Request accepted!`);
      }
      
    } catch (error) {
      console.error('❌ Error handling session:', error);
      alert(`Failed to ${requestStatus} the request. Error: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  // Handle schedule call submission
  const handleScheduleCall = async () => {
    if (!scheduleForm.date || !scheduleForm.time) {
      alert('Please fill in date and time');
      return;
    }

    try {
      setUpdating(true);

      const scheduleData = {
        sessionId: selectedSession._id,
        migrantId: selectedSession.migrantId,
        migrantName: selectedSession.migrantName,
        guideId: currentUser._id,
        guideName: currentUser.displayName,
        scheduledDate: scheduleForm.date,
        scheduledTime: scheduleForm.time,
        duration: parseInt(scheduleForm.duration),
        meetingLink: scheduleForm.meetLink,
        notes: scheduleForm.notes,
        status: 'scheduled'
      };

      const response = await fetch((import.meta.env.VITE_AUTH_BASE_URL || 'http://localhost:5000') + '/api/scheduled-calls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(scheduleData),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Update the session status to scheduled
      await fetch(`${import.meta.env.VITE_AUTH_BASE_URL || 'http://localhost:5000'}/api/guide-sessions/${selectedSession._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          status: 'scheduled',
          updatedAt: new Date().toISOString()
        }),
      });

      alert(`✅ Call scheduled successfully!\n\nDate: ${scheduleForm.date}\nTime: ${scheduleForm.time}\nDuration: ${scheduleForm.duration} minutes`);
      
      // Reset form and close modal
      setScheduleForm({
        date: '',
        time: '',
        duration: '30',
        meetLink: '',
        notes: ''
      });
      setSelectedSession(null);
      
      // Refresh sessions
      window.location.reload();

    } catch (error) {
      console.error('❌ Error scheduling call:', error);
      alert(`Failed to schedule call: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  // Simple dashboard UI
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Guide Dashboard</h1>
          <p className="text-muted-foreground">
            {currentUser.displayName} • {currentUser.email} • Guide
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
              <p className="text-xs text-muted-foreground mt-1">Need response</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {sessions.filter(s => s.requestStatus === 'accepted').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Scheduled</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {sessions.filter(s => s.status === 'completed').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Finished</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
            <CardDescription>
              New session requests waiting for your response
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sessions.filter(s => s.requestStatus === 'pending').length === 0 ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground mb-4">
                  No pending requests
                </div>
                <p className="text-sm text-muted-foreground">
                  New session requests from migrants will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.filter(s => s.requestStatus === 'pending').map((session) => (
                  <div key={session._id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">
                            {session.migrantName || 'Unknown Migrant'}
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
                        {session.requestStatus === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleSessionAction(session._id, 'accepted')}
                              disabled={updating}
                            >
                              {updating ? 'Accepting...' : 'Accept'}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-red-300 text-red-600"
                              onClick={() => handleSessionAction(session._id, 'declined')}
                              disabled={updating}
                            >
                              {updating ? 'Removing...' : 'Decline & Remove'}
                            </Button>
                          </>
                        )}
                        {session.requestStatus === 'accepted' && (
                          <Badge variant="success" className="bg-green-100 text-green-800">
                            ✅ Accepted
                          </Badge>
                        )}
                        {session.requestStatus === 'declined' && (
                          <Badge variant="destructive" className="bg-red-100 text-red-800">
                            ❌ Declined
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

        {/* Accepted Sessions */}
        {sessions.filter(s => s.requestStatus === 'accepted').length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                Accepted sessions scheduled with migrants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.filter(s => s.requestStatus === 'accepted').map((session) => (
                  <div key={session._id} className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">
                            {session.migrantName || 'Unknown Migrant'}
                          </h3>
                          <Badge variant="success" className="bg-green-100 text-green-800">
                            ✅ Accepted
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p><strong>Purpose:</strong> {session.purpose || 'General consultation'}</p>
                          <p><strong>Budget:</strong> {session.budget || 'Not specified'}</p>
                          <p><strong>Timeline:</strong> {session.timeline || 'Not specified'}</p>
                          <p><strong>Accepted:</strong> {new Date(session.updatedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <Button size="sm" variant="outline">
                          Contact Migrant
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => setSelectedSession(session)}
                        >
                          Schedule Call
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      </div>

      {/* Simple Schedule Call Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Schedule Call</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedSession(null)}
              >
                ✕
              </Button>
            </div>
            
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm">
                <strong>Migrant:</strong> {selectedSession.migrantName}
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedSession.purpose}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  value={scheduleForm.date}
                  onChange={(e) => setScheduleForm({...scheduleForm, date: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="time"
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  value={scheduleForm.time}
                  onChange={(e) => setScheduleForm({...scheduleForm, time: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                <select
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  value={scheduleForm.duration}
                  onChange={(e) => setScheduleForm({...scheduleForm, duration: e.target.value})}
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 hour</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Google Meet Link</label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  value={scheduleForm.meetLink}
                  onChange={(e) => setScheduleForm({...scheduleForm, meetLink: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes (optional)</label>
                <textarea
                  placeholder="Any additional notes for the call..."
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 h-20"
                  value={scheduleForm.notes}
                  onChange={(e) => setScheduleForm({...scheduleForm, notes: e.target.value})}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setSelectedSession(null)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={handleScheduleCall}
                disabled={!scheduleForm.date || !scheduleForm.time || updating}
              >
                {updating ? 'Scheduling...' : 'Schedule Call'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardGuide;