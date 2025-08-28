# Couch Roguelite Party Game (LAN‑Only)

A living‑room, couch‑co‑op **RPG/roguelite party game** designed for one TV and a handful of phones.  
The **TV** shows the game board/action; **phones** act as controllers. Everything runs on your PC over local Wi‑Fi—**no internet required**. A **Sober Mode** toggle (not done, might not be done) lets you swap any “drinking” penalties for points/exercises/water - to be done after the drinking game is fully finished.

---

## How to Play (Quick Start)

1. **Start the app** on your PC and connect the PC to the TV (HDMI or casting).
2. Open **`/server/home`** on the TV. It creates a lobby and displays a join URL and QR code.
3. Each player navigates to **`/client/home`** on their phone, enters a **name** (and optionally picks a **class/trait**), and then taps **Join**.
4. Once all players have joined, the host clicks **Start** on the TV.  
   The backend handles sending all necessary state updates for game prompts, phase changes, and results.
5. In case of a page reload or if a phone goes to sleep, the client will reconnect and retrieve the current game state from the backend.

---

## Migration from WebSocket to Backend Communication

*Note: The project has migrated away from WebSocket communication to a backend-driven API approach. The following points describe the changes:*

- **Backend Endpoints Only:**  
  All interactions (e.g., joining a lobby, triggering game phases, fetching snapshots, etc.) now use HTTP endpoints. The `/api/ws` endpoint is no longer used.

- **Frontend Cleanup in Progress:**  
  Some remnants of the old WebSocket-based code may still exist in the frontend source. These are maintained for backward compatibility during the migration but will be removed as the new backend approach is fully adopted.

- **Consistent State via REST API:**  
  Clients make REST API calls to join the lobby, retrieve snapshots, and perform game actions. The backend now serves as the single source of truth for the current game state.

---

## Topology

- **Routes**
  - `/server/home` — Creates/Shows a lobby and join QR.
  - `/client/home` — Controller UI and join form.
  - **Backend API Endpoints** — Replaces WebSocket communication. For example:
    - `POST /api/lobby` to create a new lobby.
    - `GET /api/snapshot` to retrieve the full game state snapshot.
    - Other endpoints for player and vote actions.

- **Process**
  - A single Node process maintains the authoritative game state.
  - Only one active lobby is managed at a time (or a map of lobbies for multiple games).

---

## Lifecycle (High Level)

`server boot → host opens /server/home → lobby created → players join via /client/home → host starts game → game phases managed by backend APIs`

---

## Detailed Communication Flow

### 1) Boot + Lobby Creation
- The host accesses `/server/home` which triggers the creation of a lobby in memory.
- A human‑friendly **lobbyCode** (e.g., “ABCD”) is generated along with a unique lobby seed.
- The server automatically selects an appropriate LAN IP and builds the join URL/QR code:
  `http://<LAN-IP>:3000/client/home?lobby=<code>`.
- The UI displays the current lobby code, join URL, and a real‑time roster of players with a disabled **Start** button until at least one player has joined.

### 2) Client Join Screen (`/client/home`)
- When a user accesses `/client/home`, the app reads the `lobby` code from the query string (or prompts for it).
- A join form is displayed where the player enters their name and (optionally) selects a trait/class.
- Upon tapping **Join**, the client calls the appropriate backend endpoint (e.g., `POST /api/players`) to register and join the lobby.
- The player’s `playerKey` is stored locally to allow seamless reconnects.

### 3) Backend-Powered Game Updates
- Instead of a persistent WebSocket, clients now poll or use long-polling (if needed) to retrieve game state updates, or subscribe using a new mechanism provided by the backend.
- The backend endpoint (`GET /api/snapshot`) returns a snapshot containing the phase, current prompt (if any), roster, and current server time.
- The client maps the response to update the UI accordingly.

### 4) Handling Reconnection and State Sync
- On page reload or if the connection is interrupted, the client will:
  - Read the stored `playerKey` from local storage.
  - Call the join endpoint to reattach to the game session.
  - Retrieve the current game snapshot to resync the UI.
- **Legacy Remains:**  
  Some legacy WebSocket connection logic is still present in the frontend code. This code is being phased out and serves only as a transitional bridge until the migration is complete.

---

## Quick Test Plan

- **Lobby Creation:**  
  Start the app and navigate to `/server/home`. Confirm that a lobby code, join URL, and QR code are presented and that the correct LAN IP is used.

- **Player Join:**  
  From a mobile device, navigate to `/client/home`, enter the required details, and join the lobby. Verify that the player appears in the lobby roster and that the start button is enabled when applicable.

- **Data Sync:**  
  After joining, trigger state changes (e.g., start the game, vote, etc.) and confirm that all clients reliably receive the updated game state from the backend.

- **Reconnection:**  
  Simulate a disconnection by refreshing the client page. Confirm that the stored `playerKey` is used to rejoin the lobby and that the UI correctly synchronizes with the current game state.

---

## Notes

- **Network:**  
  The app is designed for LAN-only operation where all communication is same-origin. This avoids CORS issues and simplifies deployment in a local network environment.

- **Transition Phase:**  
  While the backend approach is now the primary communication method, engineers should note that the frontend may still contain vestiges of the old WebSocket-based code. These will be refactored out as the migration is finalized.