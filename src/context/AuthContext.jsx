import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('workmind_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const { data } = await api.get('/api/auth/me');
          setUser(data.user);
        } catch (error) {
          console.error("Auth init failed", error);
          setToken(null);
          localStorage.removeItem('workmind_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password, companyKey) => {
    const { data } = await api.post('/api/auth/login', { email, password, companyKey });
    localStorage.setItem('workmind_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('workmind_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, isAuthenticated: !!user, setUser, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
