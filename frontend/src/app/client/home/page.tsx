/*
 * Controller (phone) screen. This page reads the `lobby` query string from
 * the URL and renders a join form. When the user submits the form it
 * establishes a WebSocket connection and sends a JOIN message. On success
 * the client shows a waiting state. The implementation here covers the
 * first join flow; additional screens will be swapped in when game phases
 * are implemented.
 */
import JoinClient from '../../../components/JoinClient';

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ClientHomePage({ searchParams }: Props) {
  const lobbyCodeParam = searchParams?.lobby;
  const lobbyCode = Array.isArray(lobbyCodeParam) ? lobbyCodeParam[0] : lobbyCodeParam || '';
  return <JoinClient initialLobbyCode={lobbyCode} />;
}