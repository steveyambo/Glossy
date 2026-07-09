'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { api } from '@/lib/api';
import type { AuthResponse, UserProfile } from '@/lib/types';

interface AuthContextValue {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, displayName: string, password: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = 'lueur_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async (t: string) => {
    try {
      const profile = await api.get<UserProfile>('/api/users/me', t);
      setUser(profile);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setToken(stored);
      loadProfile(stored).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [loadProfile]);

  const applyAuth = (res: AuthResponse) => {
    localStorage.setItem(STORAGE_KEY, res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const login = async (email: string, password: string) => {
    const res = await api.post<AuthResponse>('/api/auth/login', { email, password });
    applyAuth(res);
  };

  const register = async (email: string, displayName: string, password: string) => {
    const res = await api.post<AuthResponse>('/api/auth/register', { email, displayName, password });
    applyAuth(res);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setUser(null);
  };

  const refreshProfile = async () => {
    if (token) await loadProfile(token);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé à l’intérieur de <AuthProvider>.');
  return ctx;
}
