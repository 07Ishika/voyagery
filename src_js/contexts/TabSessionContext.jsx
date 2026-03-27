import { createContext, useContext, useState, useEffect } from 'react';

const TabSessionContext = createContext();

export const useTabSession = () => {
  const context = useContext(TabSessionContext);
  if (!context) {
    throw new Error('useTabSession must be used within a TabSessionProvider');
  }
  return context;
};

export const TabSessionProvider = ({ children }) => {
  const [tabId, setTabId] = useState(null);
  const [tabUser, setTabUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Generate unique tab ID
  useEffect(() => {
    let currentTabId = sessionStorage.getItem('tabId');
    if (!currentTabId) {
      currentTabId = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('tabId', currentTabId);
    }
    setTabId(currentTabId);
    console.log('🔍 TabSession: Tab ID:', currentTabId);
  }, []);

  // Load tab-specific user data
  useEffect(() => {
    if (tabId) {
      loadTabUser();
    }
  }, [tabId]);

  const loadTabUser = async () => {
    try {
      // First check if there's a tab-specific user stored
      const storedUser = localStorage.getItem(`tabUser_${tabId}`);
      if (storedUser) {
        const user = JSON.parse(storedUser);
        console.log('🔍 TabSession: Loaded stored user for tab:', user.displayName, 'Role:', user.role);
        setTabUser(user);
        setLoading(false);
        return;
      }

      // If no tab-specific user, check server session
      const response = await fetch(`${import.meta.env.VITE_AUTH_BASE_URL || 'http://localhost:5000'}/auth/user`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const user = await response.json();
        console.log('🔍 TabSession: Loaded server user:', user.displayName, 'Role:', user.role);
        setTabUser(user);
        // Store user for this tab
        localStorage.setItem(`tabUser_${tabId}`, JSON.stringify(user));
      } else {
        console.log('🔍 TabSession: No authenticated user');
        setTabUser(null);
      }
    } catch (error) {
      console.error('❌ TabSession: Error loading user:', error);
      setTabUser(null);
    } finally {
      setLoading(false);
    }
  };

  const setTabUserData = (user) => {
    console.log('🔍 TabSession: Setting user for tab:', user?.displayName, 'Role:', user?.role);
    setTabUser(user);
    if (user && tabId) {
      localStorage.setItem(`tabUser_${tabId}`, JSON.stringify(user));
    } else if (tabId) {
      localStorage.removeItem(`tabUser_${tabId}`);
    }
  };

  const loginAsUser = async (userId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_AUTH_BASE_URL || 'http://localhost:5000'}/auth/demo-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const user = await response.json();
        setTabUserData(user);
        return user;
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('❌ TabSession: Login error:', error);
      throw error;
    }
  };

  const logoutTab = () => {
    console.log('🔍 TabSession: Logging out tab:', tabId);
    setTabUser(null);
    if (tabId) {
      localStorage.removeItem(`tabUser_${tabId}`);
    }
  };

  const refreshTabUser = async () => {
    setLoading(true);
    await loadTabUser();
  };

  const value = {
    tabId,
    tabUser,
    loading,
    setTabUserData,
    loginAsUser,
    logoutTab,
    refreshTabUser,
    isAuthenticated: !!tabUser,
    isGuide: tabUser?.role === 'guide',
    isMigrant: tabUser?.role === 'migrant'
  };

  return (
    <TabSessionContext.Provider value={value}>
      {children}
    </TabSessionContext.Provider>
  );
};