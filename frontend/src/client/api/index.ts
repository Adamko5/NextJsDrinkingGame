// Consolidated exports for all API clients. Importing from this file
// provides access to the strongly typed clients for interacting with
// backend endpoints.

import LobbyClient from './LobbyClient';
import PlayerClient from './PlayerClient';
import SnapshotClient from './SnapshotClient';
import VoteClient from './VoteClient';

const baseUrl = "http://localhost:8080";
export const lobbyClient = new LobbyClient(baseUrl);
export const playerClient = new PlayerClient(baseUrl);
export const snapshotClient = new SnapshotClient(baseUrl);
export const voteClient = new VoteClient(baseUrl);