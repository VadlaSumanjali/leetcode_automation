import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('leetcode_daily_token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('leetcode_daily_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('leetcode_daily_token');
      if (storedToken) {
        try {
          const res = await apiClient.get('/auth/me');
          if (res?.data) {
            setUser(res.data);
            localStorage.setItem('leetcode_daily_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.error('Failed to restore session:', err.message);
          setToken(null);
          setUser(null);
          localStorage.removeItem('leetcode_daily_token');
          localStorage.removeItem('leetcode_daily_user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const handleLogin = (authToken, authUser) => {
    setToken(authToken);
    setUser(authUser);
    localStorage.setItem('leetcode_daily_token', authToken);
    localStorage.setItem('leetcode_daily_user', JSON.stringify(authUser));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('leetcode_daily_token');
    localStorage.removeItem('leetcode_daily_user');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('leetcode_daily_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated: Boolean(token && user),
        login: handleLogin,
        logout: handleLogout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
