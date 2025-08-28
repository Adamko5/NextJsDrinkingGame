import { pickLanIp } from '../../../util/ip-picker';
import HostLobby from './components/HostLobby';

export default function ServerHomePage() {
  const lanIp = pickLanIp();
  const port = process.env.PORT || '3000';
  const joinUrl = `http://${lanIp}:${port}/client/home`;

  // Screen for displaying the join information for players,
  //   as well as the players who already joined
  // This should display ./components/HostLobby.tsx
  //   and ./components/Roster.tsx, in the middle of the screen

}