// This file defines the TypeScript interfaces and enums representing the
// data structures exchanged between the frontend and backend. Having a
// strongly typed contract makes it easy to reason about the shape of
// responses and ensures the API clients return consistent data.

export interface DifficultyColor {
  name: string;
  color: string;
}

export const difficultyColors: DifficultyColor[] = [
  { name: 'Easy', color: '#10b610ff' },
  { name: 'Medium', color: '#e1ff00ff' },
  { name: 'Hard', color: '#ff9900ff'},
  { name: 'Impossible', color: '#ff1100ff'}
];

export function getDifficultyByName(name: string): DifficultyColor {
  const difficulty = difficultyColors.find((c) => c.name === name);
  if (!difficulty) {
    return { name: 'Unknown', color: '#000000ff' };
  }
  return difficulty;
}

export interface GameClass {
  name: string;
  description: string;
  difficulty: DifficultyColor;
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
  binary?: boolean;
  forPlayer?: Player;
  forOption?: string
}

export interface Snapshot {
  players: Player[];
  lobby: Lobby;
  // Kotlin uses ConcurrentHashMap ; model this as a Record/Map
  votes: Record<string, Vote>;
}
