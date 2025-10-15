'use client';

import apiServices from '@/services/apiService';
import { AuthService } from '@/services/authService';
import StorageService from '@/services/storageService';
import { UserDetail } from '@/types/api';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: UserDetail | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ access: string; refresh: string; user: UserDetail }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    // Use a flag to prevent double-execution in development
    let mounted = true;

    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);

        // Check if we have stored auth data
        const { user: storedUser, authToken } =
          StorageService.getStoredAuthData();

        if (storedUser && authToken && mounted) {
          setUser(storedUser);

          // Optionally verify token is still valid
          try {
            await apiServices.auth.getCurrentUser();
          } catch (error) {
            // Token is invalid, clear auth data
            if (mounted) {
              logout();
            }
          }
        }
      } catch (error) {
        console.error('AuthContext: Error checking auth status:', error);
        if (mounted) {
          logout();
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuthStatus();

    return () => {
      mounted = false;
    };
  }, []); // Empty dependency array - only run once

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    const authResponse = await apiServices.auth.login({ username, password });
    setUser(authResponse.user);
    setIsLoading(false);
    return {
      access: authResponse.token,
      refresh: authResponse.refreshToken,
      user: authResponse.user
    };
  };

  const logout = () => {
    setUser(null);
    StorageService.clearAuthData();
  };

  const refreshUser = async () => {
    try {
      const userData = await apiServices.auth.getCurrentUser();
      setUser(userData);

      // Update stored user data
      StorageService.setUser(userData);
    } catch (error) {
      console.error('Error refreshing user:', error);
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
