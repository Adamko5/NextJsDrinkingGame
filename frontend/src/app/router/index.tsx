"use client";

// Re‑export the Router component and related types to provide a clean
// import path for consumers. For example:
//   import Router from '../router';
//   <Router role="client" />

export { default } from "./Router";
export type { RouterProps } from "./Router";
export { phaseMap } from "./phaseMap";
export type { Role, PhaseScreens } from "./phaseMap";
