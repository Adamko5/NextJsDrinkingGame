"use client";

import React, { Suspense } from 'react';
import { SnapshotContextValue, useSnapshot } from '../state/SnapshotContext';
import { phaseMap, PhaseScreens, Role } from './phaseMap';
import ClientContainer from './screen_containers/client/client';
import ServerContainer from './screen_containers/server/server';

export interface RouterProps {
  role: Role;
  /** Optional fallback element to show while loading a screen. */
  fallback?: React.ReactNode;
}

/**
 * Top‑level router for the drinking game.  Based on the current
 * snapshot and role this component selects the appropriate screen
 * from the phase map and renders it within a container.  While
 * loading snapshots it shows the provided fallback, and it
 * gracefully handles missing phases or roles.
 */
export default function Router({ role, fallback }: RouterProps) {
  const { snapshot, error }: SnapshotContextValue = useSnapshot();

  // Define a centered style using flexbox.
  const centeredStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
  };

  // Show fallback only if snapshot is not yet loaded.
  if (!snapshot) {
    return <>{fallback ?? <div style={centeredStyle}>Loading…</div>}</>;
  }

  // Surface snapshot errors.
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Determine which set of screens applies to the current phase.
  const phaseNumber = snapshot.lobby?.phase ?? 1;
  const screensForPhase: PhaseScreens = (phaseMap as Record<number, any>)[phaseNumber];
  if (!screensForPhase) {
    return <div>Unknown phase: {phaseNumber}</div>;
  }

  // Look up the screen for the current role.
  const ScreenComponent = screensForPhase[role] as React.ComponentType<any> | undefined;
  if (!ScreenComponent) {
    return (
      <div>
        No screen defined for role {role} in phase {phaseNumber}
      </div>
    );
  }

  return (
    <Suspense fallback={fallback ?? <div style={centeredStyle}>Loading screen…</div>}>
      {role === 'client' ? (
        <ClientContainer ScreenComponent={ScreenComponent}
          backgroundImage={screensForPhase.backgroundImage}
          backgroundVideo={screensForPhase.backgroundVideo}
        />
      ) : (
        <ServerContainer ScreenComponent={ScreenComponent}
          backgroundImage={screensForPhase.backgroundImage}
          backgroundVideo={screensForPhase.backgroundVideo}
        />
      )}
    </Suspense>
  );
}