# Couch Roguelite Party Game (LAN-Only)

A living-room, couch-co-op **RPG/roguelite party game** designed for one TV and a handful of phones.  
The **TV** shows the game board/action; **phones** act as controllers. Everything runs on your PC over local Wi-Fi—**no internet required**. A **Sober Mode** toggle lets you swap any “drinking” penalties for points/exercises/water - to be done after the drinking game is fully finished.

## How to Play (Quick Start)

1. **Start the app** on your PC and connect the PC to the TV (HDMI or casting).
2. Open **`/server/home`** on the TV. It creates a lobby and shows a **QR code** + join URL.
3. Each player scans the QR (or enters the URL) to open **`/client/home`** on their phone, then enters a **name** (and optionally picks a **class/trait**).
4. When everyone’s in, the host presses **Start** on the TV.  
   The server pushes prompts (vote, quiz, reflex, etc.) to phones in real time—**no refreshes** needed.
5. If a phone sleeps/reloads, it **rejoins automatically** and picks up the current screen.

---

# Join Flow (WS-only)

This project runs as a **single Next.js monolith** with two screens, served from one Node process: a Next.js HTTP handler plus a small custom Node HTTP server that performs WebSocket upgrades on `/api/ws` (so the app stays same-origin and runs on a single port).
- **TV/Host:** `/server/home`
- **Phone/Controller:** `/client/home`

Everything is **local/LAN-only**, all game state is **in memory**, and the join/auth flow uses a simple **playerKey** carried over WebSocket. No DB and no security hardening—just fast party vibes.

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
- [ ] On first `/server/home` load, create a lobby in memory.
- [ ] Generate a human-friendly **lobbyCode** (e.g., “ABCD”) and a **seed**.
- [ ] Bind the server to `0.0.0.0` and auto-select the first non-internal IPv4 from `os.networkInterfaces()` to build a join URL/QR:
  `http://<LAN-IP>:3000/client/home?lobby=<code>`.
  The host UI should display the chosen LAN IP and offer a **Cycle IPs** button to pick a different interface if needed. Also provide a manual lobby-code input on the client in case the QR/URL is unreachable.
- [ ] Show a roster panel (initially empty) and a **Start** button (disabled until ≥1 player).

### 1) Client Join Screen (`/client/home`)
- [ ] Read `lobby` from querystring. If missing, provide a lobby code input.
- [ ] Display a simple **join form**:
  - Name (required)
  - Trait/class (optional/required — your choice)
  - **Join** button
- [ ] Cache form inputs locally so a refresh doesn’t wipe them.

### 2) Open WebSocket (WS-only flow)
- [ ] When the user taps **Join**:
  - Open a WebSocket connection to `/api/ws` served by the same Node process (not a serverless API route).
  - Immediately send a `JOIN` message with:
    - `lobbyCode`
    - `name`
    - `trait`
    - `rejoinKey` (if present in `localStorage`)
- [ ] Keep the WS open for the rest of the session. On reconnect the client resends `JOIN` with `rejoinKey` to reclaim the player.

### 3) Server: Handle `JOIN`
- [ ] Validate that the lobby exists and is `status === 'lobby'` (or `playing` if you allow late joins).
- [ ] If a `rejoinKey` matches an existing player, **reattach** this connection to that player.
- [ ] Otherwise:
  - Create a **new player** (`id`, `name`, `trait`, `connected = true`).
  - Generate a **playerKey** (short random string) and store a mapping `playerKey → playerId` in memory for future reclaims.
- [ ] Store `connId` (the socket id) and optional `ip` metadata.
- [ ] On success send back `JOIN_OK` to that socket with `{ playerId, playerKey, snapshot }` where `snapshot` is a full state snapshot (phase, currentPrompt if any, roster, and `serverNow` epoch-ms). Clients use `serverNow` to compute clock offset and display consistent deadlines.
- [ ] Broadcast a `ROSTER` update to the host screen and all clients.

### 4) Client: Handle `JOIN_OK`
- [ ] Save `playerKey` in `localStorage.rejoinKey`.
- [ ] Use the included snapshot + `serverNow` to resync UI (compute a single clock offset: `offset = Date.now() - serverNow`). Show **Waiting for host…** state after resync.
- [ ] If WS drops, auto-reconnect with exponential backoff and resend `JOIN` with `rejoinKey`.

### 5) Presence (lightweight)
- [ ] On WS `close`: mark the player `connected = false`, broadcast `ROSTER`. Consider a short grace timeout (e.g., 30s) before removing players permanently to allow brief disconnects.
- [ ] On client reconnect: send `JOIN` with `rejoinKey` to reclaim without user action.
- [ ] Use heartbeat ping/pong every ~15s to detect dead sockets quickly.

### 6) Lock & Start
- [ ] On `/server/home`, enable **Start** when ≥1 player is connected.
- [ ] Clicking **Start**:
  - Flip lobby to `status = 'playing'`.
  - Freeze the roster (or keep it open if you want late joins).
  - Broadcast the first **phase**/**prompt** to all clients (see “Server-Driven Screens”).

---

## Server-Driven Screens (no refreshes)

Do **not** navigate pages on the controller. Keep `/client/home` mounted and **switch views by state** when the server broadcasts a prompt.

- **Server → Clients**
  - `PROMPT` (e.g., to vote/answer)
  - `RESULT` (resolution/totals)
  - `PHASE` (high-level phase changes)
  - `ROSTER` (who’s in)

- **Clients → Server**
  - `JOIN` (initial + rejoin)
  - `VOTE_SUBMIT` / `ANSWER` (user input)
  - (Optional) `EMOTE`

**Example flow (vote):**
1. Host clicks “Start vote” on the TV.
2. Server broadcasts `PROMPT { kind: 'VOTE', question, choices, deadline }`.
3. Phones instantly swap to the **Vote** view.
4. Phones send `VOTE_SUBMIT { choice }` over WS.
5. Server tallies; on completion or timeout, sends `RESULT { kind: 'VOTE', totals }`.
6. Phones switch to **Results** view; server moves to the next prompt/phase.

---

## Event Reference (message names only)

> Shapes are descriptive; use whatever fields you need. Keep it tiny.

**Client → Server**
- `JOIN` — `{ lobbyCode, name?, trait?, rejoinKey? }`
- `VOTE_SUBMIT` — `{ choice }`
- `ANSWER` — `{ payload }` (quiz/reflex/rhythm/etc.)

**Server → Client**
- `JOIN_OK` — `{ playerId, playerKey, snapshot: { phase, currentPrompt?, roster, serverNow } }` (snapshot sent to resync clients immediately)
- `ROSTER` — `{ players: [{ id, name, trait, connected }, ...] }`
- `PROMPT` — `{ kind: 'VOTE'|'QUIZ'|'REFLEX'|..., data, deadline }` (deadline is absolute epoch ms, server-enforced)
- `RESULT` — e.g. `{ kind: 'VOTE', totals }`
- `PHASE` — `{ name: 'lobby'|'playing'|'ended', detail? }`
- (Optional) `TOAST` — `{ msg }`

---

## Host Screen Expectations (`/server/home`)
- Shows: lobby code, LAN URL/QR, roster list (live), Start button.
- Reacts to `ROSTER` broadcasts and updates instantly.
- After Start: displays the current phase/prompt and any timers.

## Controller Screen Expectations (`/client/home`)
- Shows join form until `JOIN_OK`.
- After join: shows **Waiting** state.
- On `PROMPT`: switch to the requested view (Vote/Quiz/etc.) immediately.
- On `RESULT`: show result view, then await next `PROMPT`/`PHASE`.

---

## Reconnect Behavior

- If the app reloads or the phone sleeps/wakes:
  - Reopen WS and send `JOIN` with `rejoinKey` from `localStorage`.
  - Server reattaches the socket to the same player and sends the **current phase** so the UI can catch up.

---

## Quick Test Plan

- **Single join:** one phone joins; host sees it; Start becomes enabled.
- **Multiple joins:** 3–4 phones; roster reflects names/traits instantly.
- **Reconnect:** kill a phone’s WS (airplane mode), then return; it reclaims the same player.
- **Prompt push:** start a vote; phones switch to the Vote view without reloading.
- **Timeout:** let one phone not answer; server resolves on deadline and pushes Results.

---

## Notes

- IP address can be captured as **optional metadata** for diagnostics, but identity uses `playerKey`.
- Keep everything **same-origin** (UI & WS on the same host/port) to avoid CORS headaches on LAN.
- Show the **LAN URL + QR** prominently on the TV to make joining painless.
