import { Lobby } from '../models';

export default class LobbyClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  async createLobby(): Promise<Lobby> {
    const response = await fetch(`${this.baseUrl}/api/lobby`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to create lobby: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data as Lobby;
  }

  async getLobby(): Promise<Lobby | null> {
    const response = await fetch(`${this.baseUrl}/api/lobby`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch lobby: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data as Lobby | null;
  }

  async startLobby(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/lobby/start`, {
      method: 'POST',
      headers: {
        'Accept': 'text/plain',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to start lobby: ${response.status} ${response.statusText}`);
    }
    return response.text();
  }

  async advancePhase(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/lobby/advancePhase`, {
      method: 'POST',
      headers: {
        'Accept': 'text/plain',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to advance phase: ${response.status} ${response.statusText}`);
    }
    return response.text();
  }

  async advancePhaseBy(advanceBy: number): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/lobby/advancePhaseBy?advanceBy=${encodeURIComponent(advanceBy)}`, {
      method: 'POST',
      headers: {
        'Accept': 'text/plain',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to advance phase by ${advanceBy}: ${response.status} ${response.statusText}`);
    }
    return response.text();
  }
}