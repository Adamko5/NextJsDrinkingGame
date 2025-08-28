"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Snapshot } from '../../client/models';
import { snapshotClient } from '../../client/api';

/**
 * Context shape for providing the current game snapshot to consumer components.
 *
 * Consumers can read the latest snapshot, inspect loading or error state, and
 * trigger a manual refresh if desired. Components must be wrapped in a
 * {@link SnapshotProvider} to access this context via the {@link useSnapshot}
 * hook.
 */
export interface SnapshotContextValue {
  snapshot: Snapshot | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

const SnapshotContext = createContext<SnapshotContextValue | undefined>(undefined);

export interface SnapshotProviderProps {
  children: React.ReactNode;
  /**
   * Polling interval in milliseconds. Defaults to 500 (0.5 seconds). A
   * shorter interval will produce more real‑time updates at the cost of more
   * network requests.
   */
  intervalMs?: number;
}

export function SnapshotProvider({ children, intervalMs = 500 }: SnapshotProviderProps) {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSnapshot = async () => {
    setLoading(true);
    try {
      const data = await snapshotClient.getSnapshot();
      setSnapshot(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSnapshot();
    const id = setInterval(fetchSnapshot, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  const value: SnapshotContextValue = {
    snapshot,
    loading,
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