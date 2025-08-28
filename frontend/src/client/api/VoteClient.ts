// Client for vote-related backend endpoints. Supports creating new votes,
// retrieving all votes, and fetching a single vote by name/identifier.

import type { Vote } from '../models';

export interface AddVoteRequest {
  byPlayer: string;
  binary?: boolean | null;
  forPlayer?: string | null;
}

export default class VoteClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  /**
   * Cast a new vote. Requires at least one of `binary` or `forPlayer` to
   * be supplied. Returns the persisted {@link Vote} on success.
   */
  async addVote(req: AddVoteRequest): Promise<Vote> {
    const { byPlayer, binary = null, forPlayer = null } = req;
    if (binary === null && forPlayer === null) {
      throw new Error('Either binary or forPlayer must be provided when casting a vote');
    }
    const response = await fetch(`${this.baseUrl}/api/votes`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ byPlayer, binary, forPlayer }),
    });
    if (!response.ok) {
      throw new Error(`Failed to add vote: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data as Vote;
  }

  /**
   * Retrieve a map of all votes keyed by vote identifier. If no votes exist
   * an empty object is returned.
   */
  async getVotes(): Promise<Record<string, Vote>> {
    const response = await fetch(`${this.baseUrl}/api/votes`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch votes: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data as Record<string, Vote>;
  }

  /**
   * Fetch a single vote by its name or identifier. Rejects if the vote is
   * not found (404) or another error occurs.
   */
  async getVote(name: string): Promise<Vote> {
    const response = await fetch(`${this.baseUrl}/api/votes/${encodeURIComponent(name)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch vote '${name}': ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data as Vote;
  }
}
