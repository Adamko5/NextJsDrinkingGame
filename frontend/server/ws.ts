import type { RawData, WebSocket, WebSocketServer } from 'ws';
import { lobbyManager } from './lobby';

// Wire up WebSocket server events. Each connection may be associated with
// a player (if they send a JOIN message) or may simply observe the lobby
// roster (e.g. the host screen). Messages are tiny JSON envelopes with
// `{ type, ...payload }` keys. Only JOIN and ROSTER are handled here.
export function setupWebSocketServer(wss: WebSocketServer) {
  // Heartbeat: ping clients every 15 seconds and terminate if they don't respond.
  const heartbeatInterval = setInterval(() => {
    wss.clients.forEach((client: any) => {
      if ((client as any).isAlive === false) {
        return client.terminate();
      }
      (client as any).isAlive = false;
      try {
        client.ping();
      } catch {
        // ignore
      }
    });
  }, 15000);

  // When a new socket connects we attach listeners. We keep track of
  // the lobbyCode and playerId to mark them disconnected on close.
  wss.on('connection', (ws: WebSocket, req: any) => {
    // Track liveness for heartbeat
    (ws as any).isAlive = true;
    ws.on('pong', () => {
      (ws as any).isAlive = true;
    });

    let currentLobbyCode: string | null = null;
    let currentPlayerId: string | null = null;

  ws.on('message', (data: RawData) => {
      let msg: any;
      try {
        msg = JSON.parse(data.toString());
      } catch (err) {
        console.error('Invalid JSON from client', err);
        return;
      }
      if (!msg || typeof msg.type !== 'string') return;
      switch (msg.type) {
        case 'JOIN': {
          const { lobbyCode, name, trait, rejoinKey } = msg;
          try {
            const { player } = lobbyManager.addOrRejoinPlayer(lobbyCode, name, trait, rejoinKey);
            currentLobbyCode = lobbyCode;
            currentPlayerId = player.id;
            // Send the initial snapshot back to the joining client. Only include
            // the roster and server time for now. Additional game state can be
            // added later when phases/prompts are implemented.
            const roster = lobbyManager.getRoster(lobbyCode);
            const response = {
              type: 'JOIN_OK',
              playerId: player.id,
              playerKey: player.playerKey,
              snapshot: {
                roster,
                serverNow: Date.now(),
              },
            };
            ws.send(JSON.stringify(response));
            // Broadcast roster update to all connected sockets
            broadcastRoster(wss, roster);
          } catch (err: any) {
            // Send an error message back to the client so the UI can display it
            ws.send(JSON.stringify({ type: 'ERROR', message: err.message }));
          }
          break;
        }
        case 'START': {
          // Only a host can start the game. The host must provide a lobbyCode.
          const { lobbyCode } = msg;
          if (typeof lobbyCode !== 'string') {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Missing lobbyCode' }));
            break;
          }
          try {
            // flip lobby status
            lobbyManager.startGame(lobbyCode);
            // send PHASE update to all clients. Use a numeric phase id so the
            // client-side phase tracker can map it to the correct screen.
            const payload = JSON.stringify({ type: 'PHASE', name: 1 });
            wss.clients.forEach((client) => {
              if (client.readyState === client.OPEN) {
                client.send(payload);
              }
            });
          } catch (err: any) {
            ws.send(JSON.stringify({ type: 'ERROR', message: err.message }));
          }
          break;
        }
        case 'VOTE': {
          // Clients send { type: 'VOTE', ...payload }. Ensure we know which
          // player and lobby this socket corresponds to before accepting.
          if (!currentLobbyCode || !currentPlayerId) {
            console.log('Error in VOTE.');
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Not joined' }));
            break;
          }
          try {
            // Store the vote in the lobby state and broadcast an update.
            lobbyManager.setVote(currentLobbyCode, currentPlayerId, msg);
            const votes = lobbyManager.getVotes(currentLobbyCode);
            const payload = JSON.stringify({ type: 'VOTES', votes });
            wss.clients.forEach((client) => {
              if (client.readyState === client.OPEN) {
                client.send(payload);
              }
            });
            console.log(`Received VOTE from ${currentPlayerId} in ${currentLobbyCode}`, msg);
          } catch (err: any) {
            ws.send(JSON.stringify({ type: 'ERROR', message: err.message }));
          }
          break;
        }
        default:
          // Unknown message type; ignore for now
          break;
      }
    });

    ws.on('close', () => {
      if (currentLobbyCode && currentPlayerId) {
        lobbyManager.markDisconnected(currentLobbyCode, currentPlayerId);
        const roster = lobbyManager.getRoster(currentLobbyCode);
        broadcastRoster(wss, roster);
      }
    });
  });
  // Clean up the heartbeat interval when the server closes
  wss.on('close', () => {
    clearInterval(heartbeatInterval);
  });
}

/**
 * Broadcast a roster update to all open WebSocket clients. The server does
 * not track which clients belong to which lobby yet, so everyone receives
 * updates. When multiple lobbies are supported you should filter by lobby.
 */
function broadcastRoster(wss: WebSocketServer, roster: any[]) {
  const payload = JSON.stringify({ type: 'ROSTER', roster });
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(payload);
    }
  });
}