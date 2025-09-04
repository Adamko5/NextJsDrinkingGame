// API client for player management. Provides methods for adding a new
// player to the lobby and retrieving player information.

import type { Player } from '../models';

export interface AddPlayerRequest {
  name: string;
  gameClassName: string;
  color: string;
}

export default class PlayerClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  /**
   * Add a player to the current lobby. Returns the newly created
   * {@link Player} object.
   */
  async addPlayer(req: AddPlayerRequest): Promise<Player> {
    const response = await fetch(`${this.baseUrl}/api/players`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: req.name, gameClassName: req.gameClassName , color: req.color }),
    });
    if (!response.ok) {
      throw new Error(`Failed to add player: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data as Player;
  }

  /**
   * Retrieve the list of all players currently joined in the lobby.
   */
  async getPlayers(): Promise<Player[]> {
    const response = await fetch(`${this.baseUrl}/api/players`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch players: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data as Player[];
  }

  /**
   * Fetch a single player by name. Rejects if the player does not exist.
   */
  async getPlayer(playerName: string): Promise<Player> {
    const response = await fetch(`${this.baseUrl}/api/players/${encodeURIComponent(playerName)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch player '${playerName}': ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data as Player;
  }
}
