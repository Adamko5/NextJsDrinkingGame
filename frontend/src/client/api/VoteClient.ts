import { Vote } from '../models';

/**
 * Request body for adding a vote. A vote must specify the player who is
 * casting it via `byPlayer` and can either be binary (yes/no) or target
 * another player. Both `binary` and `forPlayer` are optional in the
 * request type because the frontend may allow the user to specify only
 * one at a time, but at least one must be provided when calling
 * {@link VoteClient.addVote}. The backend will treat a missing value as
 * null.
 */
export interface AddVoteRequest {
  byPlayer: string;
  binary?: boolean | null;
  forPlayer?: string | null;
}

/**
 * Client for interacting with vote-related endpoints. Supports creating
 * votes, retrieving the map of all votes and looking up a single vote.
 */
export default class VoteClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  /**
   * Add a new vote. The backend returns the persisted {@link Vote} on
   * success. If both `binary` and `forPlayer` are undefined this method
   * will throw synchronously to prevent sending an invalid request.
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
   * Retrieve all votes. The backend returns a map keyed by a vote name or
   * identifier. This method resolves to a {@code Record<string, Vote>}
   * containing all ongoing votes.
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
   * Retrieve a single vote by its name/identifier. If the vote does not
   * exist the backend returns a 404 and this method will reject.
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