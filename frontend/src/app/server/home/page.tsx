/*
 * Host (TV) screen. This server component is rendered on the server on
 * initial request. It creates a lobby if one does not already exist and
 * determines the LAN IP to build a join URL. The bulk of the UI lives in
 * the HostLobby client component, which subscribes to roster updates via
 * WebSocket on the client side.
 */
import { lobbyManager, pickLanIp } from '../../../../server/lobby';
import HostLobby from '../../../components/HostLobby';

export default function ServerHomePage() {
  // Create or retrieve the current lobby. The lobby persists for the
  // lifetime of the process and holds all players. A new lobby is created
  // the first time `/server/home` is rendered after a restart.
  const lobby = lobbyManager.createLobby();
  const lanIp = pickLanIp();
  const port = process.env.PORT || '3000';
  const joinUrl = `http://${lanIp}:${port}/client/home?lobby=${lobby.code}`;
  const initialRoster = lobby.players.map(({ id, name, trait, connected }) => ({ id, name, trait, connected }));
  return (
    <HostLobby
      lobbyCode={lobby.code}
      joinUrl={joinUrl}
      initialRoster={initialRoster}
      lanIp={lanIp}
    />
  );
}