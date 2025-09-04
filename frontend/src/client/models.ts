// This file defines the TypeScript interfaces and enums representing the
// data structures exchanged between the frontend and backend. Having a
// strongly typed contract makes it easy to reason about the shape of
// responses and ensures the API clients return consistent data.

export interface GameClass {
  name: string;
  description: string;
  imageSrc: string;
}

export enum LobbyStatus {
  LOBBY = 'LOBBY',
  PLAYING = 'PLAYING',
  ENDED = 'ENDED',
}

export interface Lobby {
  status: LobbyStatus; // default is LOBBY server-side
  phase: number;       // default is 1 server-side
}

export interface Player {
  name: string;
  gameClass: GameClass;
  connected: boolean;  // defaults true server-side
  playerKey: string;
  color: string;
}

export interface Vote {
  binary: boolean | null;
  forPlayer: Player | null;
}

export interface Snapshot {
  players: Player[];
  lobby: Lobby | null;
  // Kotlin uses ConcurrentHashMap ; model this as a Record/Map
  votes: Record<string, Vote>;
}
