"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Snapshot } from '../../client/models';
import { snapshotClient } from '../../client/api';

/**
 * The shape of the context value provided by {@link SnapshotProvider}.
 * Consumers can read the latest snapshot, the loading/error state and
 * trigger a manual refresh when needed.
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
   * Polling interval in milliseconds. Defaults to 500ms. Use a shorter
   * interval for more real‑time updates at the expense of additional
   * network requests.
   */
  intervalMs?: number;
}

/**
 * Provides the current game snapshot to any descendant component. Internally
 * this component polls the backend at the given interval and updates the
 * context value whenever new data is fetched. Wrap any part of your app
 * that needs access to the game state in this provider.
 */
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
    // Fetch immediately on mount
    fetchSnapshot();
    // Then poll at the specified interval
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

/**
 * Consume the snapshot context. Components using this hook must be
 * descendants of {@link SnapshotProvider}.
 */
export function useSnapshot(): SnapshotContextValue {
  const ctx = useContext(SnapshotContext);
  if (!ctx) {
    throw new Error('useSnapshot must be used within a SnapshotProvider');
  }
  return ctx;
}
