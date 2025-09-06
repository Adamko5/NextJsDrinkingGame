"use client";

import React, { useState, useEffect } from 'react';
import Input from '../../../../components/general/Input';
import Label from '../../../../components/general/Label';
import Button from '../../../../components/general/Button';
import ClassPicker from './components/ClassPicker';
import ColorPicker from './components/ColorPicker';
import DisplayPlayer from '@/components/specific/DisplayPlayer';
import styles from './Home.module.css';
import { playerClient } from '../../../../client/api/index';
import { GameClasses } from '@/constants/classes';
import { PlayerColors } from '@/constants/player-colors';
import type { Player } from '@/client/models';
import { useCookie } from '../../../state/CookieManager';
import { getPlayerByKey } from '@/util/util';

/**
 * The Home screen presented to players on their phones.  It allows
 * the player to enter their name, select a character class and a colour,
 * and join the lobby.  Once joined, a confirmation message along with
 * the player's avatar is shown.  The layout centres the join form on
 * the page and uses the general Input and Button components for a
 * consistent look.
 */
export default function ClientHome() {
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>(GameClasses[0].name);
  // Track the selected colour by name. Default to the first colour in the palette.
  const [selectedColor, setSelectedColor] = useState<string>(PlayerColors[0].name);
  // Store the joined player once successfully added.
  const [joinedPlayer, setJoinedPlayer] = useState<Player | null>(null);
  // Error messages for duplicate name and colour conditions.
  const [nameError, setNameError] = useState<string | null>(null);
  const [colorError, setColorError] = useState<string | null>(null);

  // Retrieve cookie functionality.
  const { currentPlayerKey, setCurrentPlayerKey } = useCookie();

  // On component mount, check if a player exists in the cookie and retrieve it.
  useEffect(() => {
    async function fetchPlayerFromCookie() {
      if (currentPlayerKey && !joinedPlayer) {
        try {
          // Assuming a backend API to fetch all players.
          const players: Player[] = await playerClient.getPlayers();
          const playerFound = getPlayerByKey(currentPlayerKey, players);
          if (playerFound) {
            setJoinedPlayer(playerFound);
          }
        } catch (err) {
          console.error('Error fetching players on load:', err);
        }
      }
    }
    fetchPlayerFromCookie();
  }, [currentPlayerKey, joinedPlayer]);

  /**
   * Handles submission of the join form.  Sends the player's name, class and
   * colour to the backend.  Displays validation errors when the name or
   * colour are already taken, otherwise stores the returned Player in
   * state to trigger the joined view.
   */
  async function handleJoin(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      alert('Please enter your name before joining.');
      return;
    }
    // Clear previous error messages.
    setNameError(null);
    setColorError(null);
    try {
      // Look up the colour code for the selected colour name.
      const colorObj = PlayerColors.find((c) => c.name === selectedColor);
      const colourCode = colorObj ? colorObj.code : '';
      // Attempt to add the player. Await the response to inspect success/failure.
      const player = await playerClient.addPlayer({
        name,
        gameClassName: selectedClass,
        color: colourCode,
      });
      // If the backend returns an empty name, the player already exists.
      if (!player.name) {
        setNameError(`Player ${name} already exists!`);
        return;
      }
      // If the backend returns an empty colour, the colour is already used.
      if (!player.color) {
        setColorError('Color is already used!');
        return;
      }
      // No errors – save the returned player to trigger the joined view.
      setJoinedPlayer(player);
      // Store the returned player's key in the cookie.
      if (player.playerKey) {
        setCurrentPlayerKey(player.playerKey);
      }
    } catch (err: any) {
      // Log unexpected errors and surface a basic alert.
      console.error(err);
      alert((err && err.message) || 'Failed to join the game.');
    }
  }

  return (
    <div className={styles.container}>
      {joinedPlayer ? (
        <div className={styles.card}>
          <div className={styles.joinedContainer}>
            <p className={styles.joinedMessage}>Joined!</p>
            {/* Display the newly joined player with their colour and class. */}
            <DisplayPlayer player={joinedPlayer} />
          </div>
        </div>
      ) : (
        <form className={styles.card} onSubmit={handleJoin}>
          <h1 className={styles.title}>Join the Game</h1>
          <div className={styles.field}>
            <Label htmlFor="playerName" required>
              Name
            </Label>
            <Input
              id="playerName"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {nameError && <p className={styles.error}>{nameError}</p>}
          </div>
          <div className={styles.field}>
            <Label required>Select your class</Label>
            <ClassPicker value={selectedClass} onChange={setSelectedClass} />
          </div>
          <div className={styles.field}>
            <Label required>Select your colour</Label>
            <ColorPicker value={selectedColor} onChange={setSelectedColor} />
            {colorError && <p className={styles.error}>{colorError}</p>}
          </div>
          <div className={styles.actions}>
            <Button type="submit" label="Join" />
          </div>
        </form>
      )}
    </div>
  );
}