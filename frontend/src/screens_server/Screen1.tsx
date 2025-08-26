"use client";

import React from 'react';
import styles from './Screen1.module.css';
import Roster from '../components/Roster';
import DisplayVotes from '../components/DisplayVotes';

interface PlayerRow {
  id: string;
  name: string;
  trait?: string;
  connected: boolean;
}

export default function Screen1({ initialPlayers }: { initialPlayers?: PlayerRow[] }) {
  const [players, setPlayers] = React.useState<PlayerRow[]>(initialPlayers || []);

  // TODO: later we'll wire real-time updates via WebSocket or a shared store.
  return (
    <div className={styles.container}>
      <DisplayVotes players={players} initialMode="binary"/>
    </div>
  );
}