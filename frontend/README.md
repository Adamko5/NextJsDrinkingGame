# Couch Roguelite Party Game (LAN‑Only)

A living‑room, couch‑co‑op **RPG/roguelite party game** designed for one TV and a handful of phones.  
The **TV** shows the game board/action; **phones** act as controllers. Everything runs on your PC over local Wi‑Fi—**no internet required**. A **Sober Mode** toggle lets you swap any “drinking” penalties for points/exercises/water - to be done after the drinking game is fully finished.

## How to Play (Quick Start)

1. **Start the app** on your PC and connect the PC to the TV (HDMI or casting).
2. Open **`/server/home`** on the TV. It creates a lobby and shows a **QR code** + join URL.
3. Each player scans the QR (or enters the URL) to open **`/client/home`** on their phone, then enters a **name** (and optionally picks a **class/trait**).
4. When everyone’s in, the host presses **Start** on the TV.  
   The server pushes prompts (vote, quiz, reflex, etc.) to phones in real time—**no refreshes** needed.
5. If a phone sleeps/reloads, it **rejoins automatically** and picks up the current screen.

---

## Join Flow (WS‑only)

This project runs as a **single Next.js monolith** with two screens, served from one Node process: a Next.js HTTP handler plus a small custom Node HTTP server that performs WebSocket upgrades on `/api/ws` (so the app stays same‑origin and runs on a single port).

- **TV/Host:** `/server/home`
- **Phone/Controller:** `/client/home`

Everything is **local/LAN‑only**, all game state is **in memory**, and the join/auth flow uses a simple **playerKey** carried over WebSocket. No DB and no security hardening—just fast party vibes.

---

## Goals

- Let phones join a lobby shown on the TV.
- Keep players connected as they refresh/sleep/rejoin.
- Zero page refreshes for state changes (server pushes new views via WebSocket).

---

## Topology

- **Routes**
  - `/server/home` — creates/shows a lobby and join QR
  - `/client/home` — controller UI and join form
  - `/api/ws` — WebSocket endpoint (both directions)

- **Process**
  - Single Node process holds the **authoritative game state**.
  - One active lobby at a time (or a tiny map of lobbies if you want multiple).

---

## Minimal Data (concepts, not code)

- **Lobby:** `{ code, status: 'lobby'|'playing'|'ended', players: {} }`
- **Player:** `{ id, name, trait, connected, playerKey?, connId?, ip? }`
- **playerKey:** short random string returned on join; saved in `localStorage` to reclaim the same player on reconnect.

---

## Lifecycle (high level)

`server boot → host opens /server/home → lobby created → players join via /client/home → host starts → game phases`

---

## Detailed TODOs

### 0) Boot + Lobby

- On first `/server/home` load, create a lobby in memory.
- Generate a human‑friendly **lobbyCode** (e.g., “ABCD”) and a **seed**.
- Bind the server to `0.0.0.0` and auto‑select the first non‑internal IPv4 from `os.networkInterfaces()` to build a join URL/QR: `http://<LAN IP>:3000/client/home?lobby=<CODE>`.
  The host UI should display the chosen LAN IP and offer a **Cycle IPs** button to pick a different interface if needed. Also provide a manual lobby‑code input on the client in case the QR/URL is unreachable.
- Show a roster panel (initially empty) and a **Start** button (disabled until ≥1 player).

### 1) Client Join Screen (`/client/home`)

- Read `lobby` from querystring. If missing, provide a lobby code input.
- Display a simple **join form**:
  - Name (required)
  - Trait/class (optional/required — your choice)
  - **Join** button
- Cache form inputs locally so a refresh doesn’t wipe them.

### 2) Open WebSocket (WS‑only flow)

- When the user taps **Join**:
  - Open a WebSocket connection to `/api/ws` served by the same Node process (not a serverless API route).
  - Immediately send a `JOIN` message with:
    - `lobbyCode`
    - `name`
    - `trait`
    - `rejoinKey` (if present in `localStorage`)
- Keep the WS open for the rest of the session. On reconnect the client resends `JOIN` with `rejoinKey` to reclaim the player.

### 3) Server: Handle `JOIN`

- Validate that the lobby exists and is `status === 'lobby'` (or `playing` if you allow late joins).
- If a `rejoinKey` matches an existing player, **reattach** this connection to that player.
- Otherwise:
  - Create a **new player** (`id`, `name`, `trait`, `connected = true`).
  - Generate a **playerKey** (short random string) and store a mapping `playerKey → playerId` in memory for future reclaims.
- Store `connId` (the socket id) and optional `ip` metadata.
- On success send back `JOIN_OK` to that socket with `{ playerId, playerKey, snapshot }` where `snapshot` is a full state snapshot (phase, currentPrompt if any, roster, and `serverNow` epoch‑ms). Clients use `serverNow` to compute clock offset and display consistent deadlines.
- Broadcast a `ROSTER` update to the host screen and all clients.

### 4) Client: Handle `JOIN_OK`

- Save `playerKey` in `localStorage.rejoinKey`.
- Use the included snapshot + `serverNow` to resync UI (compute a single clock offset: `offset = Date.now() - serverNow`). Show **Waiting for host…** state after resync.
- If WS drops, auto‑reconnect with exponential backoff and resend `JOIN` with `rejoinKey`.

### 5) Presence (lightweight)

- On WS `close`: mark the player `connected = false`, broadcast `ROSTER`. Consider a short grace timeout (e.g., 30s) before removing players permanently to allow brief disconnects.
- On client reconnect: send `JOIN` with `rejoinKey` to reclaim without user action.
- Use heartbeat ping/pong every ~15s to detect dead sockets quickly.

### 6) Lock & Start

- On `/server/home`, enable **Start** when ≥1 player is connected.
- Clicking **Start**:
  - Flip lobby to `status = 'playing'`.
  - Freeze the roster (or keep it open if you want late joins).
  - Broadcast the first **phase**/**prompt** to all clients (see “Server‑Driven Screens”).

---

## Server‑Driven Screens (no refreshes)

Do **not** navigate pages on the controller. Keep `/client/home` mounted and **switch views by state** when the server broadcasts a prompt.

- **Server → Clients**
  - `PROMPT` (e.g., to vote/answer)
  - `RESULT` (resolution/totals)
  - `PHASE` (high‑level phase changes)
  - `ROSTER` (who’s in)

- **Clients → Server**
  - `JOIN` (initial + rejoin)
  - `VOTE_SUBMIT` / `ANSWER` (user input)
  - (Optional) `EMOTE`

---

## How to run locally (LAN)

1. Ensure you have **Node.js** installed on your machine. Clone this repository and install dependencies using `npm install` from the project root.
2. Start the development server with `npm run dev`. The server binds to `0.0.0.0:3000`, making it reachable on your local network.
3. On the host machine connected to the TV, open `http://localhost:3000/server/home`. A new lobby is created, displaying the lobby code, the detected LAN IP, a join URL and a QR code.
4. On each phone on the same Wi‑Fi/hotspot, either scan the QR code or manually open `http://<LAN IP>:3000/client/home?lobby=<CODE>` replacing `<LAN IP>` with the address shown on the TV and `<CODE>` with the lobby code. Enter a name (and optionally a trait) and press **Join**.
5. As players join, the roster on the TV updates in real time. Once at least one player is connected, the **Start** button becomes enabled. Pressing it will begin the game in a future iteration.

## Manual test plan

These steps can be used to verify that the first two stages of the join flow work correctly:

- **Lobby creation**: Run `npm run dev` and navigate to `/server/home`. Confirm that a lobby code, join URL and QR code are displayed. The LAN IP should match one of your machine’s IPv4 addresses.
- **Single join**: From a phone on the same network, open the join URL. Enter a name and join. The TV should immediately show your name in the roster and enable the **Start** button.
- **Multiple joins**: Open the join page from two or more phones. Each time a phone joins, verify that the roster updates correctly with all names. Closing a phone’s tab should mark that player as disconnected (grey circle).
- **Rejoin**: After joining, refresh the phone’s browser. The client should reconnect automatically using the stored player key. The roster will briefly mark the player as disconnected and then connected again once the WebSocket reattaches.
- **LAN reachability**: If the default LAN IP isn’t reachable (e.g. due to multiple network interfaces), refresh the host page until a working IP is selected. A future improvement will expose a “Cycle IPs” button.