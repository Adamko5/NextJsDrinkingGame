import type { RawData, WebSocket, WebSocketServer } from 'ws';
import { lobbyManager } from './lobby';

/**
 * Context attached to each WebSocket connection. Used to track which lobby
 * and player a given socket belongs to so that later messages can be
 * associated with the right state. When a client sends a JOIN message we
 * populate these values; on disconnect they are used to mark the player
 * offline.
 */
interface ClientContext {
  lobbyCode: string | null;
  playerId: string | null;
}

/**
 * Interval in milliseconds at which the server pings clients to verify they
 * are still alive. If a client fails to respond with a pong the server will
 * terminate the connection. Keeping a heartbeat prevents ghost sockets from
 * lingering forever and ensures lobby state stays consistent.
 */
const HEARTBEAT_INTERVAL_MS = 15_000;

/**
 * Attach WebSocket event handlers to a given server. Each connection may be
 * associated with a player (if they send a JOIN) or may simply observe the
 * lobby (e.g. the host screen). Incoming messages are JSON objects with a
 * `type` field. Unknown message types are ignored. A heartbeat is also
 * established to cull dead connections.
 */
export function setupWebSocketServer(wss: WebSocketServer): void {
  // Send a ping to all clients on a fixed interval. The `isAlive` flag is
  // toggled when we receive a pong from the client. If the flag remains
  // false on the next tick we terminate the socket. This helps reclaim
  // disconnected sockets quickly without waiting for TCP timeouts.
  const heartbeatInterval = setInterval(() => {
    wss.clients.forEach((client: any) => {
      if (client.isAlive === false) {
        client.terminate();
        return;
      }
      client.isAlive = false;
      try {
        client.ping();
      } catch {
        // ignore ping errors; connection may already be closing
      }
    });
  }, HEARTBEAT_INTERVAL_MS);

  wss.on('connection', (ws: WebSocket, _req: any) => {
    // Attach a liveness flag for heartbeat tracking
    (ws as any).isAlive = true;
    ws.on('pong', () => {
      (ws as any).isAlive = true;
    });

    // Maintain the lobby and player associated with this socket
    const ctx: ClientContext = { lobbyCode: null, playerId: null };

    // Dispatch incoming messages based on type
    ws.on('message', (data: RawData) => {
      handleMessage(ws, data, ctx, wss);
    });

    // On close, mark the player disconnected and broadcast roster
    ws.on('close', () => {
      handleClose(ctx, wss);
    });
  });

  // Clean up the heartbeat interval when the server closes
  wss.on('close', () => {
    clearInterval(heartbeatInterval);
  });
}

/**
 * Top‑level message dispatcher. Parses the JSON payload and calls the
 * appropriate handler based on the `type` field. Unknown or malformed
 * messages are ignored.
 */
function handleMessage(
  ws: WebSocket,
  data: RawData,
  ctx: ClientContext,
  wss: WebSocketServer,
): void {
  let msg: any;
  try {
    msg = JSON.parse(data.toString());
  } catch {
    console.error('Invalid JSON from client');
    return;
  }
  if (!msg || typeof msg.type !== 'string') return;

  switch (msg.type) {
    case 'JOIN':
      handleJoin(ws, msg, ctx, wss);
      break;
    case 'START':
      handleStart(ws, msg, wss);
      break;
    case 'VOTE':
      handleVote(ws, msg, ctx, wss);
      break;
    default:
      // Unknown message type; ignore silently
      break;
  }
}

/**
 * Handle a client request to join a lobby. Will create or reattach a player
 * in the appropriate lobby and return an initial snapshot of state. Also
 * broadcasts the updated roster to all sockets so hosts can update their
 * displays.
 */
function handleJoin(
  ws: WebSocket,
  msg: any,
  ctx: ClientContext,
  wss: WebSocketServer,
): void {
  const { lobbyCode, name, trait, rejoinKey } = msg;
  try {
    const { player } = lobbyManager.addOrRejoinPlayer(
      lobbyCode,
      name,
      trait,
      rejoinKey,
    );
    ctx.lobbyCode = lobbyCode;
    ctx.playerId = player.id;

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
    // Broadcast roster update to all clients
    broadcastRoster(wss, roster);

    // If the lobby has already started playing, notify the newly connected
    // client of the current phase. We only support a single phase ("1")
    // today, but this makes the protocol forward‑compatible with more
    // screens. Without this the client would remain stuck in the lobby
    // when refreshing or rejoining after the game has begun.
    const status = lobbyManager.getStatus(lobbyCode);
    if (status && status !== 'lobby') {
      const phasePayload = JSON.stringify({ type: 'PHASE', name: '1' });
      ws.send(phasePayload);
    }
  } catch (err: any) {
    ws.send(JSON.stringify({ type: 'ERROR', message: err.message }));
  }
}

/**
 * Handle a host sending a START message. Flips lobby status to 'playing'
 * and broadcasts a PHASE message to all clients. The `name` field on the
 * PHASE payload indicates which screen clients should render.
 */
function handleStart(
  ws: WebSocket,
  msg: any,
  wss: WebSocketServer,
): void {
  const { lobbyCode } = msg;
  if (typeof lobbyCode !== 'string') {
    ws.send(JSON.stringify({ type: 'ERROR', message: 'Missing lobbyCode' }));
    return;
  }
  try {
    lobbyManager.startGame(lobbyCode);
    const payload = JSON.stringify({ type: 'PHASE', name: '1' });
    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(payload);
      }
    });
  } catch (err: any) {
    ws.send(JSON.stringify({ type: 'ERROR', message: err.message }));
  }
}

/**
 * Handle a VOTE message from a client. Associates the vote with the current
 * lobby and player and broadcasts the aggregated votes to all clients. Votes
 * are keyed by playerId on the server and handed back verbatim to clients.
 */
function handleVote(
  ws: WebSocket,
  msg: any,
  ctx: ClientContext,
  wss: WebSocketServer,
): void {
  if (!ctx.lobbyCode || !ctx.playerId) {
    ws.send(JSON.stringify({ type: 'ERROR', message: 'Not joined' }));
    return;
  }
  try {
    lobbyManager.setVote(ctx.lobbyCode, ctx.playerId, msg);
    const votes = lobbyManager.getVotes(ctx.lobbyCode);
    const payload = JSON.stringify({ type: 'VOTES', votes });
    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(payload);
      }
    });
    console.log(`Received VOTE from ${ctx.playerId} in ${ctx.lobbyCode}`, msg);
  } catch (err: any) {
    ws.send(JSON.stringify({ type: 'ERROR', message: err.message }));
  }
}

/**
 * Handle socket close by marking the player disconnected and broadcasting
 * the updated roster. A short grace period is implemented in lobbyManager
 * before players are pruned.
 */
function handleClose(ctx: ClientContext, wss: WebSocketServer): void {
  const { lobbyCode, playerId } = ctx;
  if (lobbyCode && playerId) {
    lobbyManager.markDisconnected(lobbyCode, playerId);
    const roster = lobbyManager.getRoster(lobbyCode);
    broadcastRoster(wss, roster);
  }
}

/**
 * Broadcast the current roster to all connected clients. When supporting
 * multiple lobbies you should filter by lobby code here. The roster is
 * serialised once per call and reused for all clients.
 */
function broadcastRoster(wss: WebSocketServer, roster: any[]): void {
  const payload = JSON.stringify({ type: 'ROSTER', roster });
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(payload);
    }
  });
}