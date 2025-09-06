// Entry point for all strongly typed API clients. Importing from this
// module instantiates each client with the configured base URL and
// exposes them for use throughout the app. Adjust the base URL as
// necessary for your deployment environment.

import { pickLanIp } from '@/util/ip-picker';
import LobbyClient from './LobbyClient';
import PlayerClient from './PlayerClient';
import SnapshotClient from './SnapshotClient';
import VoteClient from './VoteClient';


export const HOST = pickLanIp();
const baseUrl = "http://" + HOST + ":8080";

export const lobbyClient = new LobbyClient(baseUrl);
export const playerClient = new PlayerClient(baseUrl);
export const snapshotClient = new SnapshotClient(baseUrl);
export const voteClient = new VoteClient(baseUrl);
