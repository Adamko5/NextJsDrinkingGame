"use client";

import React from 'react';
import styles from './Roster.module.css';

/**
 * Represents a player in the lobby.  The avatar may be omitted,
 * in which case an initial derived from the player name is used.
 */
export interface Player {
  name: string;
  avatarUrl?: string;
}

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
      {players.map((player, idx) => {
        const initial = player.name.charAt(0).toUpperCase();
        return (
          <div key={idx} className={styles.player}>
            {player.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={player.avatarUrl}
                alt={player.name}
                className={styles.avatar}
              />
            ) : (
              <div className={styles.avatar}>{initial}</div>
            )}
            <div className={styles.name}>{player.name}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Roster;