"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Snapshot } from '../../client/models';
import { snapshotClient } from '../../client/api';

export interface SnapshotContextValue {
  snapshot: Snapshot | null;
  error: Error | null;
  refresh: () => Promise<void>;
}

const SnapshotContext = createContext<SnapshotContextValue | undefined>(undefined);

export interface SnapshotProviderProps {
  children: React.ReactNode;
  /**
   * Polling interval in milliseconds. Defaults to 500ms.
   */
  intervalMs?: number;
}

export function SnapshotProvider({ children, intervalMs = 500 }: SnapshotProviderProps) {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  // Removed the loading state to prevent blinking, since we don’t need it anymore.
  const [error, setError] = useState<Error | null>(null);

  const fetchSnapshot = async () => {
    try {
      const data = await snapshotClient.getSnapshot();
      setSnapshot(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    }
  };

  useEffect(() => {
    // Fetch immediately on mount
    fetchSnapshot();
    // Then poll at the specified interval
    const id = setInterval(fetchSnapshot, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  const value: SnapshotContextValue = {
    snapshot,
    error,
    refresh: fetchSnapshot,
  };

  return <SnapshotContext.Provider value={value}>{children}</SnapshotContext.Provider>;
}

export function useSnapshot(): SnapshotContextValue {
  const ctx = useContext(SnapshotContext);
  if (!ctx) {
    throw new Error('useSnapshot must be used within a SnapshotProvider');
  }
  return ctx;
}