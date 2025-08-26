import { lobbyManager } from '../../../../server/lobby';
import ServerPhaseClient from '../../../components/ServerPhaseClient';

interface Props {
  params: { phase: string };
}

export default function ServerPhasePage({ params }: Props) {
  const { phase } = params;
  // Grab the current lobby. If it doesn't exist (e.g. on hard reload) create
  // one. Using getCurrentLobby rather than createLobby prevents us from
  // accidentally creating a second lobby when the host refreshes during a game.
  const lobby = lobbyManager.getCurrentLobby() ?? lobbyManager.createLobby();
  const players = lobby.players.map(({ id, name, trait, connected }) => ({ id, name, trait, connected }));
  const votes = lobbyManager.getVotes(lobby.code);
  return <ServerPhaseClient phase={phase} initialPlayers={players} initialVotes={votes} />;
}