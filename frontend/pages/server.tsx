// 'use client' marks this page as a client component.  Both the
// SnapshotProvider and Router rely on client-side state/hooks, so the
// directive is necessary when using the pages router.
'use client';

import React from 'react';
// Import the Router and SnapshotProvider.  The Router exposes the
// different screens based on the current game phase and the role.
import Router from '../src/app/router';
import { SnapshotProvider } from '../src/app/state/SnapshotContext';

/**
 * ServerPage renders the game for the host/server role.  It wraps the
 * Router in the SnapshotProvider so that the router has access to the
 * current snapshot data.  When running the development server on
 * port 8081 this page will be served at `/server`.
 */
export default function ServerPage() {
  return (
    <SnapshotProvider>
      <Router role="server" />
    </SnapshotProvider>
  );
}