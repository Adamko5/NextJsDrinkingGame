"use client";

import React from 'react';
import styles from './Roster.module.css';
import { GameClasses, getClassByName } from '@/constants/classes';
import { Player } from '@/client/models';
import Label from '@/components/general/Label';

export interface RosterProps {
  players: Player[];
}

/**
 * Displays a list of players who have already joined the lobby.  Each
 * player is rendered with either their avatar or a coloured circle
 * containing the first letter of their name.  Names wrap under
 * their avatar.
 */
const Roster: React.FC<RosterProps> = ({ players }) => {
  if (!players || players.length === 0) {
    return <div className={styles.container}>No players have joined yet.</div>;
  }
  return (
    <div className={styles.container}>
      {players.map((player: Player, idx) => {
        return (
          <div key={idx} className={styles.player}>
            <img
              src={getClassByName(player.gameClass.name)?.imageSrc}
              alt={player.name}
              className={styles.avatar}
            />
            <Label className={styles.name}>{player.name}</Label>
          </div>
        );
      })}
    </div>
  );
};

export default Roster;