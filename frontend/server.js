// Custom server entrypoint
//
// This file bootstraps a Next.js application and attaches a WebSocket server
// on the same HTTP port. By binding to 0.0.0.0 and hosting both HTTP and
// WebSocket traffic on one process we ensure that phones and the TV can talk
// to the same origin over a LAN connection. The WebSocket handler lives in
// `server/ws.ts` and uses in‑memory state from `server/lobby.ts`.

const http = require('http');
const next = require('next');
const WebSocket = require('ws');

// Register ts-node so that we can require TypeScript files at runtime. This
// allows the server code in the `server/` directory to remain type‑checked
// without a build step. In production you may precompile these files.
require('ts-node/register');

const { setupWebSocketServer } = require('./server/ws');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Create a single HTTP server for both Next.js and WebSocket traffic.
const server = http.createServer((req, res) => {
  // Next.js handles all HTTP requests. WebSocket upgrades are handled in
  // the `upgrade` event below.
  handle(req, res);
});

// Set up a WebSocket server with noServer=true so that we can attach
// connections manually on the upgrade event. See server/ws.ts for logic.
const wss = new WebSocket.Server({ noServer: true });
setupWebSocketServer(wss);

// Delegate upgrade requests targeting `/api/ws` to the WebSocket server.
server.on('upgrade', (req, socket, head) => {
  const { url } = req;
  if (url === '/api/ws') {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    });
  } else {
    socket.destroy();
  }
});

// Prepare the Next.js app and then start listening. Binding to
// 0.0.0.0 exposes the server on the LAN so that phones can connect via
// the chosen IPv4 address.
app.prepare().then(() => {
  server.listen(port, hostname, () => {
    // eslint-disable-next-line no-console
    console.log(`> Ready on http://${hostname === '0.0.0.0' ? 'localhost' : hostname}:${port}`);
  });
});