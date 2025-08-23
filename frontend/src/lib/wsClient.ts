/*
 * Client‑side WebSocket helpers. The host screen opens a socket solely to
 * listen for ROSTER updates, while the phone screens send a JOIN request
 * and then listen for JOIN_OK and subsequent updates. These functions
 * abstract away message parsing and provide callback hooks for your React
 * components.
 */

interface HostSocketOptions {
  onRoster: (roster: any[]) => void;
}

export function setupHostSocket(onRoster: (roster: any[]) => void): WebSocket {
  const protocol = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss' : 'ws';
  const ws = new WebSocket(`${protocol}://${window.location.host}/api/ws`);
  // Expose the socket on the returned object so callers can send custom messages (e.g. START)
  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg.type === 'ROSTER') {
        onRoster(msg.roster);
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
  onError?: (message: string) => void;
}

export function createClientSocket(options: ClientSocketOptions): WebSocket {
  const protocol = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss' : 'ws';
  const ws = new WebSocket(`${protocol}://${window.location.host}/api/ws`);
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
    let msg;
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
        // Clients could use this in future to switch views
        // For now ignore in the join flow
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
  return ws;
}