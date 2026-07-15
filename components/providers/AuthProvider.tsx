'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AuthSession, getSession, saveSession, verifyCredentials,
  clearSession, clearAllAuth, getRememberedCache, loginWithCache
} from '@/lib/auth';

interface AuthContextType {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoaded: boolean;
  timeLeftMinutes: number;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  login: (u: string, p: string, k: string, remember: boolean) => Promise<boolean>;
  quickLogin: () => boolean;
  logout: (clearCache?: boolean) => void;
  hasRememberedCache: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [timeLeftMinutes, setTimeLeftMinutes] = useState(30);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [hasRememberedCache, setHasRememberedCache] = useState(false);

  // Initial client mount check
  useEffect(() => {
    const s = getSession();
    if (s) {
      setSession(s);
      const rem = Math.max(0, Math.ceil((s.expiresAt - Date.now()) / (60 * 1000)));
      setTimeLeftMinutes(rem);
    }
    setHasRememberedCache(!!getRememberedCache());
    setIsLoaded(true);
  }, []);

  // Periodic expiration check
  useEffect(() => {
    if (!session) return;
    const timer = setInterval(() => {
      const current = getSession();
      if (!current) {
        // Token expired
        setSession(null);
        setShowLoginModal(true);
      } else {
        const rem = Math.max(0, Math.ceil((current.expiresAt - Date.now()) / (60 * 1000)));
        setTimeLeftMinutes(rem);
        if (rem <= 0) {
          clearSession();
          setSession(null);
          setShowLoginModal(true);
        }
      }
    }, 10000);

    return () => clearInterval(timer);
  }, [session?.accessToken]);

  const login = async (u: string, p: string, k: string, remember: boolean): Promise<boolean> => {
    const valid = await verifyCredentials(u, p, k);
    if (!valid) return false;
    const newSession = saveSession(u.trim(), remember);
    setSession(newSession);
    setTimeLeftMinutes(30);
    setHasRememberedCache(!!getRememberedCache());
    setShowLoginModal(false);
    return true;
  };

  const quickLogin = (): boolean => {
    const newSession = loginWithCache();
    if (!newSession) return false;
    setSession(newSession);
    setTimeLeftMinutes(30);
    setShowLoginModal(false);
    return true;
  };

  const logout = (clearCache = false) => {
    if (clearCache) {
      clearAllAuth();
      setHasRememberedCache(false);
    } else {
      clearSession();
    }
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{
      session,
      isAuthenticated: !!session,
      isLoaded,
      timeLeftMinutes,
      showLoginModal,
      setShowLoginModal,
      login,
      quickLogin,
      logout,
      hasRememberedCache
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
