"use client";

import React from 'react';

// Import the screen components for each phase.  These must be
// client components if they rely on state or effects.  Server
// components may also be used so long as they do not reference
// browser‑only APIs.
import ClientHome from '../screens/client/home/Home';
import ServerHome from '../screens/server/home/Home';
import ServerVoting1 from '../screens/server/general/voting_1/Voting1';
import ClientBlankScreen from '../screens/client/blank/BlankScreen';
import ServerBlankScreen from '../screens/server/blank/BlankScreen';
import StoryTellingIntro from '../screens/server/story/intro/Intro';
import VotingPathIntro from '../screens/server/voting/intro/Intro';
import ClientVotingPathIntro from '../screens/client/voting/Intro';

export type Role = 'client' | 'server';

export type PhaseScreens = {
  client: React.ComponentType<any>;
  server: React.ComponentType<any>;
  backgroundImage?: string;
  backgroundVideo?: string;
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
    server: StoryTellingIntro,
    backgroundImage: 'backgrounds/creepy_forest_intro.png',
  },
  3: {
    client: ClientVotingPathIntro,
    server: VotingPathIntro,
    backgroundImage: 'backgrounds/forest_splitting_path.png',
  },
};