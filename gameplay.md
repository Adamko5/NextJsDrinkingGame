# Couch Roguelite Party Game (LAN‑Only)

A living‑room, couch‑co‑op **RPG/roguelite party game** designed for one TV and a handful of phones.

The **TV** shows the game board/action; **phones** act as controllers.
 - The **TV screen** is refered to as **Server**
 - The **phones** are refered to as **Clients**


Everything runs on your PC over local Wi‑Fi—**no internet required**.

---

# Classes

The players will pick a class with special powers.
Examples powers: triple voting power, triple alcoholic battle power, can skip 2 shots if drinking vodka.

**Class definitions** are here: /frontend/src/constants/classes.ts

---

# Gameplay phases

**1. Joining the game**
  - Players make their character and join the game
  - Backend allows joining only at the start of the game
---
**2. Story screen**
  - Only shown on the server
  - Story is introduced: Players wake up in a creepy forest
---
**3. First voting screen**
  - Players have to pick one of the 2 paths
---
**4. Voting result screen**
  Here, we have 2 options:
  1. Left path
  2. Right path

  Both paths will lead to a person, who will demand a drink to tell them if they're on the right path.
  He will then tell them that this is indeed correct (no matter what they picked).
  He will then warn them, that many enemies and challenges are up ahead.

  Idea:<br>
  Generate multiple AI videos of walking in the forest.<br>
  You can use the videos as transitions between screens.<br>
  Try to generate a video of the person as we come closer to him.

  TODO:<br>
  Do the TODO in Intro.tsx.

---
**5. TBD**


---