// API client for retrieving the current game snapshot. A snapshot
// contains the complete game state including lobby metadata, players
// and votes. See `../models` for the interface definitions.

import type { Snapshot } from '../models';

export default class SnapshotClient {
  /** Base URL prefix for all API calls. If left empty requests will be relative. */
  private readonly baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  /**
   * Fetch the current snapshot from the backend.
   *
   * @returns A promise resolving to a {@link Snapshot} object. Rejects
   *          if the network request fails or the response is non‑2xx.
   */
  async getSnapshot(): Promise<Snapshot> {
    const response = await fetch(`${this.baseUrl}/api/snapshot`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch snapshot: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data as Snapshot;
  }
}
