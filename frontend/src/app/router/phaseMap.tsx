"use client";

import React from 'react';

// Import the screen components for each phase.  These must be
// client components if they rely on state or effects.  Server
// components may also be used so long as they do not reference
// browser‑only APIs.
import ClientHome from '../screens/client/home/Home';
import ClientVoting1 from '../screens/client/voting1/Voting1';
import ServerHome from '../screens/server/home/Home';
import ServerVoting1 from '../screens/server/voting1/Voting1';
import ClientBlankScreen from '../screens/client/blank/BlankScreen';
import ServerBlankScreen from '../screens/server/blank/BlankScreen';

export type Role = 'client' | 'server';

export type PhaseScreens = {
  client: React.ComponentType<any>;
  server: React.ComponentType<any>;
};

/**
 * A mapping from phase number to the corresponding client and server
 * screen components.  This centralises route definitions for the
 * various stages of the game and allows the router to render the
 * appropriate component based on the current phase and role.  New
 * phases should be added here along with their screen imports.
 */
export const phaseMap: Record<number, PhaseScreens> = {
  1: {
    client: ClientHome,
    server: ServerHome,
  },
  2: {
    client: ClientBlankScreen,
    server: TODO story screen,
  },
  3: {
    client: ClientVoting1,
    server: ServerVoting1,
  },
};