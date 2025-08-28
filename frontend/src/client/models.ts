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
}

export interface Vote {
  binary: boolean | null;
  forPlayer: Player | null;
}

export interface Snapshot {
  players: Player[];
  lobby: Lobby | null;
  // Kotlin uses ConcurrentHashMap<String, Vote>; model this as a Record/Map
  votes: Record<string, Vote>;
}