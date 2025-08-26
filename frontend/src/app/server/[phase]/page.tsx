import Screen1 from '../../../screens_server/Screen1';
import { lobbyManager } from '../../../../server/lobby';

interface Props {
  params: { phase: string };
}

export default function ServerPhasePage({ params }: Props) {
  const { phase } = params;
  // You can read the lobby state here if needed:
  // const lobby = lobbyManager.getLobby(...)
  const roster = lobbyManager.getCurrentRoster();
  if (phase === '1') {
    return <Screen1 initialPlayers={roster} />;
  }
  return (
    <div style={{ padding: 24 }}>
      <h1>Phase {phase}</h1>
      <p>No server page defined for this phase yet.</p>
    </div>
  );
}
