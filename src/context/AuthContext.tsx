'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuthToken, setAuthToken, clearAuthToken, getApiBaseUrl, setApiBaseUrl, DEFAULT_API_BASE_URL } from '@/lib/api';

interface AdminUser {
  id?: string;
  username?: string;
  email?: string;
  role?: string;
}

interface AuthContextType {
  token: string | null;
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  baseUrl: string;
  login: (token: string, user: AdminUser) => void;
  logout: () => void;
  updateBaseUrl: (url: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<AdminUser | null>(null);
  const [baseUrl, setBaseUrlState] = useState<string>(DEFAULT_API_BASE_URL);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Restore session on client mount
    const storedToken = getAuthToken();
    const storedBaseUrl = getApiBaseUrl();
    setBaseUrlState(storedBaseUrl);

    if (storedToken) {
      setTokenState(storedToken);
      const savedUserStr = localStorage.getItem('hindigenous_user');
      if (savedUserStr) {
        try {
          setUserState(JSON.parse(savedUserStr));
        } catch {
          setUserState({ email: 'admin@hindigenous.com', username: 'Admin' });
        }
      } else {
        setUserState({ email: 'admin@hindigenous.com', username: 'Admin' });
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: AdminUser) => {
    setAuthToken(newToken);
    setTokenState(newToken);
    setUserState(newUser);
    localStorage.setItem('hindigenous_user', JSON.stringify(newUser));
  };

  const logout = () => {
    clearAuthToken();
    setTokenState(null);
    setUserState(null);
  };

  const updateBaseUrl = (newUrl: string) => {
    setApiBaseUrl(newUrl);
    setBaseUrlState(newUrl);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        isLoading,
        baseUrl,
        login,
        logout,
        updateBaseUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
