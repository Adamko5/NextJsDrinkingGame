import { randomInt } from 'crypto';
import { nanoid } from 'nanoid';
import os from 'os';

// Simple player representation for the lobby. Each player has a stable
// `playerKey` that is persisted on the client and used to reclaim the same
// identity on reconnect. The `connected` flag is toggled when their
// WebSocket connection opens or closes.
export interface Player {
  id: string;
  name: string;
  trait?: string;
  connected: boolean;
  playerKey: string;
}

// The lobby holds a roster of players and a lookup from playerKey to player.
export interface Lobby {
  code: string;
  /** Current status of the lobby. Players may only join while in the 'lobby' state. */
  status: 'lobby' | 'playing' | 'ended';
  players: Player[];
  playerKeyMap: Map<string, Player>;
}

/**
 * Generate a human‑friendly lobby code consisting of uppercase letters.
 * Excludes ambiguous characters (I, O) for readability on a TV.
 */
function generateLobbyCode(length = 4): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += alphabet[randomInt(alphabet.length)];
  }
  return code;
}

/**
 * Determine the first non‑internal IPv4 address on the host machine. If none
 * are available (e.g. no active LAN), fall back to localhost. This is used
 * to construct a join URL that phones can reach over Wi‑Fi or a hotspot.
 */
export function pickLanIp(): string {
  const nets = os.networkInterfaces();
  type Candidate = { name: string; address: string };
  const candidates: Candidate[] = [];

  for (const name of Object.keys(nets)) {
    const interfaces = nets[name];
    if (!interfaces) continue;
    for (const iface of interfaces) {
      if (iface.family === 'IPv4' && !iface.internal && iface.address) {
        candidates.push({ name, address: iface.address });
      }
    }
  }

  if (candidates.length === 0) return 'localhost';

  // Score candidates: prefer common physical interface names (wifi/eth)
  // and private IPv4 ranges; penalize known virtual/adapters.
  const virtualKeywords = ['vbox', 'virtual', 'vmware', 'docker', 'host-only', 'loopback', 'hyper-v', 'vethernet', 'hamachi', 'vpn'];
  const preferredRegex = /^(en|eth|ethernet|wlan|wi-?fi|wifi|wl|enp|wlp)/i;
  const privateRegex = /^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/;

  function score(c: Candidate): number {
    let s = 0;
    if (preferredRegex.test(c.name)) s += 50;
    if (privateRegex.test(c.address)) s += 10;
    const lower = c.name.toLowerCase();
    for (const k of virtualKeywords) if (lower.includes(k)) s -= 100;
    return s;
  }

  candidates.sort((a, b) => score(b) - score(a));
  return candidates[0].address || 'localhost';
}

/**
 * Singleton manager for the single in‑memory lobby. If you wish to support
 * multiple lobbies concurrently you can extend this class to hold a map
 * keyed by lobbyCode.
 */
class LobbyManager {
  private currentLobby: Lobby | null = null;

  /** A map of disconnect timers by playerId used to prune players after a grace period. */
  private disconnectTimers: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Create or return the existing lobby. The lobby code will remain the
   * same across requests to `/server/home` until the process restarts.
   */
  createLobby(): Lobby {
    if (this.currentLobby) return this.currentLobby;
    const code = generateLobbyCode();
    this.currentLobby = {
      code,
      status: 'lobby',
      players: [],
      playerKeyMap: new Map(),
    };
    return this.currentLobby;
  }

  /**
   * Look up a lobby by its code. Returns undefined if it does not exist.
   */
  getLobby(code: string): Lobby | undefined {
    if (this.currentLobby && this.currentLobby.code === code) {
      return this.currentLobby;
    }
    return undefined;
  }

  /**
   * Add a new player to the lobby or reattach to an existing player via
   * rejoinKey. If `rejoinKey` matches a stored `playerKey`, the existing
   * player is returned and marked connected. Otherwise a new player is
   * created with a fresh `playerKey`.
   */
  addOrRejoinPlayer(
    lobbyCode: string,
    name: string,
    trait: string | undefined,
    rejoinKey: string | undefined,
  ): { player: Player; isRejoin: boolean } {
    const lobby = this.getLobby(lobbyCode);
    if (!lobby) {
      throw new Error(`Lobby ${lobbyCode} does not exist`);
    }
    if (lobby.status !== 'lobby') {
      throw new Error('Lobby is not accepting new players');
    }
    // If a rejoinKey matches, reattach to that player
    if (rejoinKey) {
      const existing = lobby.playerKeyMap.get(rejoinKey);
      if (existing) {
        existing.connected = true;
        // Optionally update name/trait on rejoin if provided
        if (name) existing.name = name;
        if (trait) existing.trait = trait;
        // cancel any pending removal timer
        const timeout = this.disconnectTimers.get(existing.id);
        if (timeout) {
          clearTimeout(timeout);
          this.disconnectTimers.delete(existing.id);
        }
        return { player: existing, isRejoin: true };
      }
    }
    // Otherwise create a new player
    const playerKey = nanoid(8);
    const player: Player = {
      id: nanoid(12),
      name,
      trait,
      connected: true,
      playerKey,
    };
    lobby.players.push(player);
    lobby.playerKeyMap.set(playerKey, player);
    return { player, isRejoin: false };
  }

  /**
   * Mark a player's connection as closed. We don't remove players immediately;
   * instead we flip the `connected` flag. A future reconnection will set
   * `connected` back to true. If you wish to prune players after a timeout,
   * implement that here.
   */
  markDisconnected(lobbyCode: string, playerId: string): void {
    const lobby = this.getLobby(lobbyCode);
    if (!lobby) return;
    const player = lobby.players.find((p) => p.id === playerId);
    if (player) {
      player.connected = false;
      // schedule removal after 30s if not reconnected
      const timeout = setTimeout(() => {
        this.removePlayer(lobbyCode, playerId);
      }, 30000);
      this.disconnectTimers.set(playerId, timeout);
    }
  }

  /** Remove a player entirely from the lobby. Called after the grace timeout. */
  private removePlayer(lobbyCode: string, playerId: string): void {
    const lobby = this.getLobby(lobbyCode);
    if (!lobby) return;
    const index = lobby.players.findIndex((p) => p.id === playerId);
    if (index !== -1) {
      const player = lobby.players[index];
      lobby.playerKeyMap.delete(player.playerKey);
      lobby.players.splice(index, 1);
    }
    this.disconnectTimers.delete(playerId);
  }

  /** Flip the lobby into the playing state. No new players may join after this. */
  startGame(lobbyCode: string): void {
    const lobby = this.getLobby(lobbyCode);
    if (lobby && lobby.status === 'lobby') {
      lobby.status = 'playing';
    }
  }

  /** Return the current status of the lobby. */
  getStatus(lobbyCode: string): 'lobby' | 'playing' | 'ended' | undefined {
    const lobby = this.getLobby(lobbyCode);
    return lobby?.status;
  }

  /**
   * Return a lightweight roster for broadcasting over WebSocket. Only send
   * what the client needs to render names and connection status.
   */
  getRoster(lobbyCode: string): { id: string; name: string; trait?: string; connected: boolean }[] {
    const lobby = this.getLobby(lobbyCode);
    if (!lobby) return [];
    return lobby.players.map(({ id, name, trait, connected }) => ({ id, name, trait, connected }));
  }
}

// Ensure a single LobbyManager instance across possible module reloads or
// duplicate bundling (Next.js can sometimes create separate module copies
// in the dev server). Store the manager on `globalThis` to make it stable.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  var __NEXT_LOBBY_MANAGER__: any;
}

export const lobbyManager: LobbyManager = (global as any).__NEXT_LOBBY_MANAGER__ || ((global as any).__NEXT_LOBBY_MANAGER__ = new LobbyManager());