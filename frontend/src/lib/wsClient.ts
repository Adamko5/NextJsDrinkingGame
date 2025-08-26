/*
 * Client‑side WebSocket helpers. The host screen opens a socket solely to
 * listen for ROSTER and PHASE updates, while the phone screens send a JOIN
 * request and then listen for JOIN_OK, PHASE and subsequent updates. These
 * functions abstract away message parsing and provide callback hooks for
 * your React components.
 */

interface HostSocketOptions {
  onRoster: (roster: any[]) => void;
  /**
   * Called whenever the server broadcasts a PHASE message. The phase name
   * indicates which screen should be shown (e.g. 'playing').
   */
  onPhase?: (phaseName: string) => void;
}

/**
 * Open a WebSocket connection on the host (TV) side. The host listens for
 * roster changes and phase transitions. Callers can send messages via
 * the returned socket reference (e.g. to send START).
 */
export function setupHostSocket(
  onRoster: (roster: any[]) => void,
  onPhase?: (phaseName: string) => void,
): WebSocket {
  const protocol = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss' : 'ws';
  const ws = new WebSocket(`${protocol}://${window.location.host}/api/ws`);
  // Expose the socket on the returned object so callers can send custom messages (e.g. START)
  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg.type === 'ROSTER') {
        onRoster(msg.roster);
      } else if (msg.type === 'PHASE') {
        // Notify host about phase changes (e.g. when the game starts)
        onPhase?.(msg.name);
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
  /**
   * Called whenever the server broadcasts a PHASE message. The phase name
   * indicates which screen should be shown on the client.
   */
  onPhase?: (phaseName: string) => void;
  onError?: (message: string) => void;
}

/**
 * Create a WebSocket on the client (phone) side. It will send a JOIN
 * message on open and then listen for roster, join, phase and error events.
 */
export function createClientSocket(options: ClientSocketOptions): WebSocket {
  const protocol = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss' : 'ws';
  const ws = new WebSocket(`${protocol}://${window.location.host}/api/ws`);
  // Keep a module-level reference to the most recent client socket so other
  // UI modules can send messages (e.g. votes) without threading the socket
  // through React props. This simplifies the phone UI which mounts in a
  // different route than the join component.
  (createClientSocket as any).clientSocket = ws;
  // Also provide a well-known named export (set below) so callers can import
  // a typed reference. We assign below after the function declaration.
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
        // Notify clients about phase changes to allow view switches.
        options.onPhase?.(msg.name);
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
  // When the socket closes, clear the module-level reference if it still
  // points to this socket instance.
  ws.addEventListener('close', () => {
    try {
      if ((createClientSocket as any).clientSocket === ws) {
        (createClientSocket as any).clientSocket = null;
      }
    } catch (e) {
      // ignore
    }
  });
  return ws;
}

// Export a convenient, typed module-level clientSocket reference. Consumers
// should prefer the helper `sendVote` below for structured logging and safe
// sending.
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
    // Structured log for later parsing when debugging client-side issues.
    console.log('[wsClient] Sent VOTE', payload);
    return true;
  } catch (err) {
    console.error('[wsClient] sendVote error', err, { vote });
    return false;
  }
}