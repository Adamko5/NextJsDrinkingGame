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

# Gameplay Ideas for phases

**1. Enemies and world introduction**
  - Magical world, where drunken wizards fight for ultimate alcoholic spells and potions.
  
---

**2. Make clever ways of fighting wizards**
  - **Basic combat**
    - The Server screen will prompt everyone to drink once so the enemy is defeated.
    - **At the start of the game, the difficulty will be available - scaled with player number!**. <br>
    This will determine the health bars of enemies. The players will have to confirm on their phone, if they drank. 1 drink = 1 damage
    - Figuring out riddles, puzzles, general knowledge checks...
  - **Alcoholic Spellcasting**
    - Players who will drink will click their phone and an AI model will craft an attack from the combination of their characters
    - For example if a Russian and a Pirate attack, they will produce a Vodka an Rum based attack.<br>
    *(thier alcohol type or special power is in their character description in my constants in project files)*
  - **Final Memory Challenge** at the end of the game that will check the pleyer's attention of detail
    - For example, names of characters will be asked, or how many enemies they had to fight...
  - **AI trial**:
    - Enemies will appear 1 by 1. Every enemy will be special.
      - Example enemies:
        - Fire wizard -> beaten by water
        - Ice Wizard -> beaten by flames
    - Everyone will write 1 word to combat that enemy type 
    - AI will then make a spell from all the words and assign a damage number to it, based on how good it seems to be against that enemy

---

**3. Make creative and clever wizard characters**
  - **Enemy**
    - Evil Wizard - a basic enemy
      - Randomly placed, will require everyone to drink once, or complete something
      - **Place:** Anywhere
      - **Order of appearance in the game:** Anytime
    - Witchita Deceptia, the Witch of Deception
      - This is where the **Alcoholic Spellcasting** will take place
      - She will **lie** and explain that the only way to beat her is to make the strongest of them challenge her in a Drinking Duel
      - The true way to beat her is to get at least 50% of the players to drink together and combine a massive alcoholic spell
      - **Place:** Creepy forest
      - **Order of appearance in the game:** 1
    - Transformio Negro, the Enslaver Mage
      - Evil wizard, that curses magical beasts to be black-colored and makes them obey him
      - He will curse one of the players and they will have to play the viral impostor tiktok game.
      - **Place:** Magical cotton fields. The cotton is used for his magic.
      - **Order of appearance in the game:** 3
    - Cleveria, the All-Knowing Witch
      - Witch that will ask general knowledge questions. The players will vote for the answer.
      - Every 2nd incorrect answer means the players have to drink
      - **Place:** Ancient Library, filled with vast knowledge
      - **Order of appearance in the game:** 4
    - Kegwyrm, the Barrel-Back Drake
      - Drinks barrels full of alcohol
      - Will make a wall from barrels, the players will have to *'Drink through the wall'* to pass
      - **Place:** Barrel Cave, that is filled with barrels that often block the way.
      - **Order of appearance in the game:** 7
    - Cultia, the Mad Cultist
      - Witch with an army of cultists
      - This is where the **AI trial** will take place
      - **Place:** Underground dungeon. The players will get caught in a trap that traps the cult's victims in their dungeon.
      - **Order of appearance in the game:** 6
    - Archmage Dominatio, the Competetive Drinker - **THE FINAL BOSS**
      - Phase 1:
        - Will challenge every player to out-drink him
        - He will provide a random alcohol brand and bottle image, hinting an alcohol type, that will deal double damage next duel
        - The player, who's turn it is, will have to drink his drink and guess the alcohol type.
        - This fight goes on until Archmage Dominatio's health is 0
          - Should be about 1-2 rounds for everyone
      - Phase 2:
        - Will transcend, becoming Archmage Dominatio, the Unbeaten Drunkard
        - This is where the **Final Memory Challenge** will be held
        - He will ask questions about details from the past of the game and he players will vote for the answer
        - If they answer incorrectly, they all have to drink
      - **Place:** Epic arena
      - **Order of appearance in the game:** 8

  - **Friendly**
    - Auntie Brew, the Brewmaster Witch
      - **Place:** Creepy forest
      - **Order of appearance in the game:** 2
      - Makes magic potions of power from alcohol
      - Will make a special Hint for the players, hinting they should remember details for the **Final Memory Challenge**
      - This encounter should therefor happen **early in the game**
    - Pervo Genitalio, the Trader 
      - **Place:** Creepy forest
      - **Order of appearance in the game:** 5
      - Perverted wizard with a dildo-shaped wand
      - Will sell powerful Magical artifact(s) (will be needed to fight the final boss), if the players drink with him
  
---

**4. Design the story pattern**
  - Spell collecting
  - The wizards will reveal a secret spell to us
  - Point of the universe: Wizards fight each other to gain knowledge of secret spells

---