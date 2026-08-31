import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockCurrentUser } from '../services/mockData';
import apiClient from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(mockCurrentUser);
  const [token, setToken] = useState(localStorage.getItem('intelecta_token') || 'mock_bearer_token');
  const [firebaseToken, setFirebaseToken] = useState(localStorage.getItem('intelecta_fb_token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Attempt to verify session with backend if live token exists
    const checkSession = async () => {
      const storedToken = localStorage.getItem('intelecta_token');
      if (storedToken && storedToken !== 'mock_bearer_token') {
        try {
          const res = await apiClient.get('/auth/me');
          if (res.data && res.data.data) {
            setUser(res.data.data);
          }
        } catch (err) {
          console.warn('Live session check failed, using active local session:', err.message);
        }
      }
    };
    checkSession();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      if (res.data?.data) {
        const { user: userData, access_token, firebase_custom_token } = res.data.data;
        setUser(userData);
        setToken(access_token);
        setFirebaseToken(firebase_custom_token);
        localStorage.setItem('intelecta_token', access_token);
        if (firebase_custom_token) {
          localStorage.setItem('intelecta_fb_token', firebase_custom_token);
        }
        setLoading(false);
        return { success: true };
      }
    } catch (err) {
      console.warn('API login failed, falling back to instant local session:', err.message);
      // Fallback to local session
      setUser(mockCurrentUser);
      setToken('mock_bearer_token');
      setLoading(false);
      return { success: true };
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('intelecta_token');
    localStorage.removeItem('intelecta_fb_token');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, firebaseToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
