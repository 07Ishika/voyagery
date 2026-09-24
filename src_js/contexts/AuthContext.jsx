import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const AuthContext = createContext();
const AUTH_BASE = import.meta.env.VITE_AUTH_BASE_URL || 'http://localhost:5000';
const AUTH_TIMEOUT_MS = 4000;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const getOrCreateTabId = () => {
  let currentTabId = sessionStorage.getItem('tabId');
  if (!currentTabId) {
    currentTabId = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('tabId', currentTabId);
  }
  return currentTabId;
};

export const AuthProvider = ({ children }) => {
  const [tabId] = useState(getOrCreateTabId);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(() => window.location.pathname !== '/role');
  const fetchAbortRef = useRef(null);

  const loadTabUser = useCallback(() => {
    const storedUser = localStorage.getItem(`tabUser_${tabId}`);
    if (!storedUser) return null;
    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error('Error parsing stored user:', error);
      localStorage.removeItem(`tabUser_${tabId}`);
      return null;
    }
  }, [tabId]);

  const saveTabUser = useCallback((user) => {
    if (user) {
      localStorage.setItem(`tabUser_${tabId}`, JSON.stringify(user));
    } else {
      localStorage.removeItem(`tabUser_${tabId}`);
    }
  }, [tabId]);

  const fetchUser = useCallback(async ({ skipNetwork = false } = {}) => {
    if (fetchAbortRef.current) {
      fetchAbortRef.current.abort();
    }

    if (window.location.pathname === '/role' || skipNetwork) {
      setCurrentUser(null);
      setLoading(false);
      return;
    }

    const tabUser = loadTabUser();
    if (tabUser) {
      setCurrentUser(tabUser);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    fetchAbortRef.current = controller;
    const timeoutId = setTimeout(() => controller.abort(), AUTH_TIMEOUT_MS);

    try {
      const response = await fetch(`${AUTH_BASE}/auth/user`, {
        credentials: 'include',
        signal: controller.signal,
      });

      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user);
        saveTabUser(user);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('AuthContext: Error fetching user:', error);
      }
      setCurrentUser(null);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }, [loadTabUser, saveTabUser]);

  const logout = async () => {
    setCurrentUser(null);
    saveTabUser(null);
    localStorage.removeItem(`tabUser_${tabId}`);
  };

  const refreshUser = async () => {
    setLoading(window.location.pathname !== '/role');
    await fetchUser();
  };

  const clearTabSession = () => {
    setCurrentUser(null);
    localStorage.removeItem(`tabUser_${tabId}`);
  };

  const setUser = (user) => {
    setCurrentUser(user);
    saveTabUser(user);
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
    return () => {
      if (fetchAbortRef.current) {
        fetchAbortRef.current.abort();
      }
    };
  }, [fetchUser]);

  const value = {
    currentUser,
    loading,
    logout,
    refreshUser,
    setUser,
    clearTabSession,
    tabId,
    isAuthenticated: !!currentUser,
    isGuide: currentUser?.role === 'guide',
    isMigrant: currentUser?.role === 'migrant'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
