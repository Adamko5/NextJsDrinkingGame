"use client";

import React from 'react';
import styles from './Roster.module.css';
import type { Player } from '@/client/models';
import DisplayPlayer from '@/components/specific/DisplayPlayer';

export interface RosterProps {
  players: Player[];
  className?: string;
  style?: React.CSSProperties;
  altText?: string;
}

/**
 * Displays a list of players who have already joined the lobby.
 * Players are rendered using the DisplayPlayer component which
 * shows their class avatar and colours the name based on the
 * player’s chosen colour.  Names wrap under their avatar.
 */
const Roster: React.FC<RosterProps> = ({ players, className, style, altText }) => {
  if (!players || players.length === 0) {
    return (
      <div className={`${styles.container} ${className ?? ''}`.trim()}>
        {altText ?? 'No players have joined yet.'}
      </div>
    );
  }
  return (
    <div className={`${styles.container} ${className ?? ''}`.trim()} style={style}>
      {players.map((player: Player, idx: number) => (
        <DisplayPlayer key={idx} player={player} />
      ))}
    </div>
  );
};

export default Roster;