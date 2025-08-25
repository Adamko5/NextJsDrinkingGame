"use client";

import React from 'react';
import { classes } from '../lib/classes';
import styles from './Roster.module.css';

interface PlayerRow {
  id: string;
  name: string;
  trait?: string;
  connected: boolean;
}

export default function Roster({ players }: { players: PlayerRow[] }) {
  if (players.length === 0) {
    return <p>No players have joined yet.</p>;
  }

  // Create a map of class id to class data for quick lookups.
  const classMap: Record<string, { name: string; imageSrc: string }> = React.useMemo(() => {
    const map: Record<string, { name: string; imageSrc: string }> = {};
    classes.forEach((c) => {
      map[c.id] = { name: c.name, imageSrc: c.imageSrc };
    });
    return map;
  }, []);

  return (
    <ul className={styles.list}>
      {players.map((player) => {
        const cls = player.trait ? classMap[player.trait] : undefined;
        return (
          <li key={player.id} className={styles.card} title={player.name}>
            <div
              className={styles.avatar}
              style={cls ? { backgroundImage: `url(${cls.imageSrc})` } : undefined}
            />
            <div className={styles.name}>{player.name}</div>
          </li>
        );
      })}
    </ul>
  );
}