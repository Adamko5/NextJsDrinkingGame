import { Player } from '../models';

export interface AddPlayerRequest {
  name: string;
  gameClassName: string;
}

export default class PlayerClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  async addPlayer(req: AddPlayerRequest): Promise<Player> {
    const response = await fetch(`${this.baseUrl}/api/players`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: req.name, gameClassName: req.gameClassName }),
    });
    if (!response.ok) {
      throw new Error(`Failed to add player: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data as Player;
  }

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