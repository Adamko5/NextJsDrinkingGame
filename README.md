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

## Notes

- **Network:**  
  The app is designed for LAN-only operation where all communication is same-origin. This avoids CORS issues and simplifies deployment in a local network environment.

- **Transition Phase:**  
  While the backend approach is now the primary communication method, engineers should note that the frontend may still contain vestiges of the old WebSocket-based code. These will be refactored out as the migration is finalized.