"use client";

import React, { Suspense } from "react";
import { useSnapshot } from "../state/SnapshotContext";
import { phaseMap, Role } from "./phaseMap";

export interface RouterProps {
  role: Role;
  fallback?: React.ReactNode;
}

export default function Router({ role, fallback }: RouterProps) {
  const { snapshot, loading, error } = useSnapshot();

  if (loading || !snapshot) {
    return <>{fallback ?? <div>Loading…</div>}</>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const phaseNumber = snapshot.lobby?.phase ?? 1;
  const screensForPhase = phaseMap[phaseNumber];

  if (!screensForPhase) {
    return <div>Unknown phase: {phaseNumber}</div>;
  }

  const ScreenComponent = (screensForPhase as any)[role] as
    | React.ComponentType<any>
    | undefined;
  if (!ScreenComponent) {
    return <div>No screen defined for role “{role}” in phase {phaseNumber}</div>;
  }

  return (
    <Suspense fallback={fallback ?? <div>Loading screen…</div>}>
      <ScreenComponent />
    </Suspense>
  );
}
