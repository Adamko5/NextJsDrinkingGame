import { Snapshot } from '../models';

/**
 * Service responsible for retrieving the latest snapshot of the game from
 * the backend. A snapshot contains the lobby information, all players and
 * current votes. See {@link Snapshot} for the shape of the returned
 * object.
 */
export default class SnapshotClient {
  /**
   * Base URL prefix for all API calls. If left empty the client will
   * perform relative fetches (e.g. `/api/snapshot`) against the same
   * origin. Set this to the backend host when using a separate frontend
   * and backend origin.
   */
  private readonly baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  /**
   * Fetch the current snapshot from the backend.
   *
   * @returns A Promise resolving to a {@link Snapshot} object. Rejects if
   *          the network request fails or the backend returns a non-2xx
   *          status code.
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