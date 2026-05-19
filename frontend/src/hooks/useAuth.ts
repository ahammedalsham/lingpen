/**
 * frontend/src/hooks/useAuth.ts
 * 
 * Custom hook for authentication operations (login, logout, register).
 */

import { useState, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/services/api';
import type { TokenResponse } from '@/types/api';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setUser, setToken, logout: clearAuth } = useAuthStore();

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const { data } = await apiClient.post<TokenResponse>('/api/v1/auth/login', {
          email,
          password,
        });

        setToken(data.access_token);
        setUser(data.user);
        localStorage.setItem('access_token', data.access_token);

        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Login failed';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setUser, setToken]
  );

  const logout = useCallback(() => {
    clearAuth();
    localStorage.removeItem('access_token');
  }, [clearAuth]);

  return {
    login,
    logout,
    isLoading,
    error,
  };
}
