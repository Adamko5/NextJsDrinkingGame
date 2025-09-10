"use client";

import React from 'react';
import type { Player } from '@/client/models';
import Label from '@/components/general/Label';
import styles from './DisplayPlayer.module.css';
import { getClassByName } from '@/constants/classes';

export interface DisplayPlayerProps {
  /**
   * The player to display.  Expects a full Player object
   * including their gameClass and colour information.
   */
  player: Player;
  width?: string;
  height?: string;
}

/**
 * Renders a single player with their class avatar and name.
 * The avatar’s background and the name’s text colour are set
 * based on the player’s colour.  If the colour does not include
 * a leading hash it is prefixed automatically.  When the
 * player’s game class does not provide an image the avatar
 * remains an empty coloured circle.
 */
const DisplayPlayer: React.FC<DisplayPlayerProps> = ({ player, width, height }) => {
  // Normalise colour codes – prefix a hash if not already present.
  const formattedColor = player.color?.startsWith('#')
    ? player.color
    : `#${player.color}`;

  return (
    <div
      className={styles.player}
      style={{
        // Expose the player colour as a CSS variable for the
        // stylesheet.  Provide a fallback in case colour is
        // undefined.
        '--player-color': formattedColor || undefined,
      } as React.CSSProperties}
    >
      <div className={styles.avatar} style={{width: width || '3rem', height: height || '3rem'}}>
        <img
          src={getClassByName(player.gameClass.name)?.imageSrc}
          alt={player.name}
          className={styles.image}
        />
      </div>
      <Label className={styles.name}>{player.name}</Label>
    </div>
  );
};

export default DisplayPlayer;