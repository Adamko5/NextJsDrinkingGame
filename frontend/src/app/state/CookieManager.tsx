"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CookieTool } from './CookieTool';

export interface CookieContextValue {
  currentPlayerKey: string | null;
  error: Error | null;
  refresh: () => void;
  setCurrentPlayerKey: (key: string, days?: number) => void;
}

const CookieContext = createContext<CookieContextValue | undefined>(undefined);

export interface CookieProviderProps {
  children: React.ReactNode;
  /**
   * Polling interval in milliseconds. Defaults to 500ms.
   */
  intervalMs?: number;
}

export function CookieProvider({ children, intervalMs = 500 }: CookieProviderProps) {
  const [currentPlayerKey, setCurrentPlayerKeyState] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Fetch the current cookie value.
  const refresh = () => {
    try {
      const key = CookieTool.getCurrentPlayerKey();
      setCurrentPlayerKeyState(key);
      setError(null);
    } catch (err) {
      setError(err as Error);
    }
  };

  // Initialize and poll for cookie value.
  useEffect(() => {
    refresh();
    const id = setInterval(refresh, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  // Update the cookie value and state.
  const setCookieValue = (key: string, days?: number) => {
    try {
      CookieTool.setCurrentPlayerKey(key, days);
      setCurrentPlayerKeyState(key);
      setError(null);
    } catch (err) {
      setError(err as Error);
    }
  };

  const value: CookieContextValue = {
    currentPlayerKey,
    error,
    refresh,
    setCurrentPlayerKey: setCookieValue,
  };

  return <CookieContext.Provider value={value}>{children}</CookieContext.Provider>;
}

export function useCookie(): CookieContextValue {
  const ctx = useContext(CookieContext);
  if (!ctx) {
    throw new Error('useCookie must be used within a CookieProvider');
  }
  return ctx;
}