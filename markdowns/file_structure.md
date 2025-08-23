# Project file structure — NextJsDrinkingGame

This file documents a simple, opinionated project layout that matches the README flow (single-process Next.js + custom Node server, in-memory lobby, WebSocket upgrades on `/api/ws`). Keep it minimal and easy to navigate.

## Top-level

- package.json — project dependencies & scripts
- server.js — Node bootstrap: next handler + HTTP server that performs WebSocket upgrades on `/api/ws`
- README.md — project README (design/flow decisions)
- tsconfig.json — TypeScript config (if using TS)

## server/
Server-side runtime code (runs in the same Node process as Next.js).

- server/lobby.ts
  - Authoritative in-memory Lobby class, player management, snapshot-on-phase-change (optional JSON writes)
  - Helper: pickLanIp() to choose the first non-internal IPv4

- server/ws.ts
  - WebSocket lifecycle: onConnection, message parsing, JOIN handling, ping/pong, connId mapping, broadcast helpers
  - Graceful disconnect logic and 30s grace timeout

- server/protocol.ts
  - Message type constants and small Envelope type definition: `{ type, requestId?, payload? }`

- server/snapshots/ (optional)
  - Written JSON snapshots for debugging/reload when phases change (non-blocking writes)

## src/app (Next.js app routes)
UI code for host (TV) and client (phone). Use simple React components and server-side rendering where helpful.

- src/app/server/home/page.tsx
  - Host (TV) UI
  - Shows chosen LAN IP, "Cycle IPs" button, QR + join URL, roster, Start button, current phase and prompt

- src/app/client/home/page.tsx
  - Controller (phone) UI
  - Join form, cached inputs, waiting screen, prompt views (Vote/Quiz/Reflex), results

- src/components/QR.tsx
  - Small QR component to render the join URL as an SVG

- src/components/Roster.tsx
  - Roster display used by host and optionally client

## src/lib (shared client-side utilities)

- src/lib/wsClient.ts
  - Client WebSocket wrapper with exponential backoff reconnect, JOIN with rejoinKey, send/receive envelope, compute single clock offset using `serverNow` from `JOIN_OK`

- src/lib/storage.ts
  - Small helpers for localStorage management (rejoinKey, cached form inputs)

- src/lib/timeout.ts (optional)
  - Utilities to render deadlines consistently given serverNow + client offset

## public/
- Static assets (icons, images, QR fallbacks)

## markdowns/
- file_structure.md (this file)
- design-notes.md (optional)

## Development notes / rationale (short)

- Single Node process (server.js) keeps Next.js UI and a ws server on the same port to avoid CORS and simplify QR/join URLs.
- Server binds to `0.0.0.0` and auto-picks a LAN IPv4 for the QR; the host UI displays the chosen IP and provides a "Cycle IPs" action to select a different interface if needed.
- All authoritative state is in-memory for simplicity. The server writes optional JSON snapshots on phase changes to `server/snapshots/` for debugging and potential reload recovery (non-blocking).
- `JOIN_OK` includes a full snapshot plus `serverNow` (epoch ms). Clients compute a single offset and use server-enforced absolute deadlines (epoch ms) for consistent countdowns.
- Message envelopes are tiny JSON objects: `{ type: string, requestId?: string, payload?: any }`.

## Suggested next steps

1. Create `server.js` bootstrap and minimal `server/ws.ts` handler implementing the JOIN flow and ping/pong.
2. Scaffold `src/app/server/home/page.tsx` and `src/app/client/home/page.tsx` with basic UI and wiring to `src/lib/wsClient.ts`.
3. Add a `dev` script in `package.json` to run `node server.js` and start Next in development mode.

---

If you want, I can scaffold the minimal runnable files next (server.js, server/ws.ts, server/lobby.ts, and the two Next pages). Which files should I create first?
