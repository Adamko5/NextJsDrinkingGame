// API client for lobby management. Provides methods to create a lobby,
// retrieve the current lobby state, start the lobby, and advance the game
// phase. See `../models` for the associated types.

import type { Lobby } from '../models';

export default class LobbyClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  /**
   * Retrieve the currently active lobby. Returns `null` if no lobby exists.
   */
  async getLobby(): Promise<Lobby | null> {
    console.log("Fetching lobby from", this.baseUrl);
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

  /**
   * Transition the lobby from the waiting state into the playing state.
   * Returns a plain string on success.
   */
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

  /**
   * Advance the game phase by one. This is typically called by the host.
   */
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

  /**
   * Advance the game phase by a specific amount. Accepts an integer query
   * parameter `advanceBy` which must be encoded into the URL.
   */
  async advancePhaseBy(advanceBy: number): Promise<string> {
    const response = await fetch(
      `${this.baseUrl}/api/lobby/advancePhaseBy?advanceBy=${encodeURIComponent(advanceBy)}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'text/plain',
        },
      },
    );
    if (!response.ok) {
      throw new Error(`Failed to advance phase by ${advanceBy}: ${response.status} ${response.statusText}`);
    }
    return response.text();
  }
}
