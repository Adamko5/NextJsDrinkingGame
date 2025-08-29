"use client";

import React, { useEffect, useState } from 'react';
import HostLobby from './components/HostLobby';
import Roster, { Player } from './components/Roster';
import styles from './Home.module.css';

/**
 * The server home page displayed on the TV.  It shows the join
 * information (QR code and URL) along with a real‑time roster of
 * players who have joined the lobby.  In a fully functional
 * implementation this component would poll the backend for the
 * current lobby snapshot and update the roster accordingly.
 */
export default function ServerHomePage() {
  const [players, setPlayers] = useState<Player[]>([]);

  // Construct the join URL based on the current host and port.
  const [joinUrl, setJoinUrl] = useState('');

  useEffect(() => {
    // Determine the hostname from the browser context if available.
    const host = typeof window !== 'undefined' && window.location.hostname
      ? window.location.hostname
      : 'localhost';
    const port = process.env.PORT || '3000';
    setJoinUrl(`http://${host}:${port}/client/home`);
  }, []);

  // In lieu of a backend, simulate players joining after a delay.
  useEffect(() => {
    const timer = setTimeout(() => {
      // Example players – in a real app this data would come from the
      // server snapshot.  Push a new player only if the roster is empty
      // to prevent repeated additions on re-render.
      setPlayers((prev) => (prev.length === 0 ? [
        { name: 'Alice' },
        { name: 'Bob' },
        { name: 'Carol' },
      ] : prev));
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <HostLobby joinUrl={joinUrl} />
      </div>
      <div className={styles.section}>
        <div className={styles.title}>Roster</div>
        <Roster players={players} />
      </div>
    </div>
  );
}