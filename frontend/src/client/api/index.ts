// Entry point for all strongly typed API clients. Importing from this
// module instantiates each client with the configured base URL and
// exposes them for use throughout the app. Adjust the base URL as
// necessary for your deployment environment.

import LobbyClient from './LobbyClient';
import PlayerClient from './PlayerClient';
import SnapshotClient from './SnapshotClient';
import VoteClient from './VoteClient';

// When running the frontend alongside the backend on the same origin
// simply leave `baseUrl` empty to issue relative requests. In a
// development environment where the backend is on a different port
// specify the hostname and port here (e.g. "http://localhost:8080").
const baseUrl = 'http://localhost:8080';

export const lobbyClient = new LobbyClient(baseUrl);
export const playerClient = new PlayerClient(baseUrl);
export const snapshotClient = new SnapshotClient(baseUrl);
export const voteClient = new VoteClient(baseUrl);
