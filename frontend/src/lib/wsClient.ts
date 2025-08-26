/*
 * Client‑side WebSocket helpers. The host screen opens a socket solely to
 * listen for roster, phase and vote updates, while the phone screens send a
 * JOIN request and then listen for responses. These functions abstract
 * away message parsing and provide callback hooks for React components. A
 * module‑level reference to the most recent client socket is kept so that
 * helper functions like `sendVote` can operate without threading the
 * socket through the React tree.
 */

export interface HostSocketCallbacks {
  /**
   * Called whenever the server broadcasts a ROSTER update. Hosts should
   * update their player list accordingly.
   */
  onRoster: (roster: any[]) => void;
  /**
   * Called whenever the server broadcasts a PHASE message. The phase name
   * indicates which screen should be shown (e.g. '1' for the first game
   * screen). Optional for hosts that do not need to react to phases.
   */
  onPhase?: (phaseName: string) => void;
  /**
   * Called whenever the server broadcasts a VOTES message. The votes
   * object is keyed by playerId and contains the raw vote payload for
   * each player. Optional for hosts that do not display votes.
   */
  onVotes?: (votes: any) => void;
}

/**
 * Open a WebSocket connection on the host (TV) side. The host listens
 * for roster changes, phase transitions and votes. Callers can send
 * messages via the returned socket reference (e.g. to send START).
 */
export function setupHostSocket(
  onRoster: (roster: any[]) => void,
  onPhase?: (phaseName: string) => void,
  onVotes?: (votes: any) => void,
): WebSocket {
  const protocol =
    typeof window !== 'undefined' && window.location.protocol === 'https:'
      ? 'wss'
      : 'ws';
  const ws = new WebSocket(`${protocol}://${window.location.host}/api/ws`);
  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      switch (msg.type) {
        case 'ROSTER':
          onRoster(msg.roster);
          break;
        case 'PHASE':
          onPhase?.(String(msg.name));
          break;
        case 'VOTES':
          onVotes?.(msg.votes);
          break;
      }
    } catch {
      // ignore invalid JSON
    }
  };
  return ws;
}

interface ClientSocketOptions {
  lobbyCode: string;
  name: string;
  trait?: string;
  rejoinKey?: string;
  onRoster?: (roster: any[]) => void;
  onJoinOk?: (resp: { playerId: string; playerKey: string; snapshot: any }) => void;
  onPhase?: (phaseName: string) => void;
  onVotes?: (votes: any) => void;
  onError?: (message: string) => void;
}

/**
 * Create a WebSocket on the client (phone) side. It sends a JOIN message
 * on open and then listens for roster, join, phase, vote and error events.
 */
export function createClientSocket(options: ClientSocketOptions): WebSocket {
  const protocol =
    typeof window !== 'undefined' && window.location.protocol === 'https:'
      ? 'wss'
      : 'ws';
  const ws = new WebSocket(`${protocol}://${window.location.host}/api/ws`);
  // Keep a module‑level reference to the most recent client socket so other
  // UI modules can send messages (e.g. votes) without threading the socket
  // through React props. Assign directly on the function so the variable
  // survives HMR in Next.js dev mode.
  (createClientSocket as any).clientSocket = ws;

  ws.onopen = () => {
    const joinMsg: any = {
      type: 'JOIN',
      lobbyCode: options.lobbyCode,
      name: options.name,
      trait: options.trait,
    };
    if (options.rejoinKey) {
      joinMsg.rejoinKey = options.rejoinKey;
    }
    ws.send(JSON.stringify(joinMsg));
  };

  ws.onmessage = (event) => {
    let msg: any;
    try {
      msg = JSON.parse(event.data);
    } catch {
      return;
    }
    if (!msg || typeof msg.type !== 'string') return;
    switch (msg.type) {
      case 'ROSTER': {
        options.onRoster?.(msg.roster);
        break;
      }
      case 'JOIN_OK': {
        options.onJoinOk?.(msg);
        break;
      }
      case 'PHASE': {
        options.onPhase?.(String(msg.name));
        break;
      }
      case 'VOTES': {
        options.onVotes?.(msg.votes);
        break;
      }
      case 'ERROR': {
        options.onError?.(msg.message);
        break;
      }
      default:
        break;
    }
  };

  // When the socket closes, clear the module‑level reference if it still
  // points to this socket instance. This prevents stale sockets from
  // intercepting calls to sendVote.
  ws.addEventListener('close', () => {
    try {
      if ((createClientSocket as any).clientSocket === ws) {
        (createClientSocket as any).clientSocket = null;
      }
    } catch {
      // ignore
    }
  });
  return ws;
}

/**
 * A module‑level reference to the current client WebSocket. This value is
 * updated whenever `createClientSocket` is called. Components should not
 * rely on this directly; instead use the helper `sendVote` to ensure the
 * socket is open before sending.
 */
export let clientSocket: WebSocket | null = (createClientSocket as any).clientSocket || null;

/**
 * Send a 'VOTE' message from the client to the server. This helper does
 * runtime checks and logs the outgoing payload for easier debugging.
 * Returns true when the message was dispatched, false otherwise.
 */
export function sendVote(vote: any): boolean {
  try {
    // Refresh the exported reference in case it was set after module init.
    clientSocket = (createClientSocket as any).clientSocket || clientSocket;
    if (!clientSocket || clientSocket.readyState !== WebSocket.OPEN) {
      console.warn('[wsClient] sendVote failed: no open socket', { vote });
      return false;
    }
    const payload = { type: 'VOTE', ...vote };
    clientSocket.send(JSON.stringify(payload));
    console.log('[wsClient] Sent VOTE', payload);
    return true;
  } catch (err) {
    console.error('[wsClient] sendVote error', err, { vote });
    return false;
  }
}