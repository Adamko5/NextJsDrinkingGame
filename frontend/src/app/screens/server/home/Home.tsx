"use client";

import React, { useEffect, useState } from 'react';
import HostLobby from './components/HostLobby';
import Roster from './components/Roster';
import styles from './Home.module.css';
import { SnapshotContextValue, useSnapshot } from '../../../state/SnapshotContext';
import Button from '@/components/general/Button';
import LobbyClient from '@/client/api/LobbyClient';
import { HOST, lobbyClient } from '@/client/api';

export default function ServerHomePage() {
  const { snapshot }: SnapshotContextValue = useSnapshot();
  const [joinUrl, setJoinUrl] = useState('');

  useEffect(() => {
    const port = process.env.PORT || '8081';
    setJoinUrl(`http://${HOST}:${port}/client`);
  }, []);

  const handleStartGame = async () => {
    try {
      const result = await lobbyClient.startLobby();
      console.log("Lobby started:", result);
      // Optionally, navigate to the next screen here.
    } catch (error) {
      console.error("Error starting lobby:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <HostLobby joinUrl={joinUrl} />
        <div className={styles.buttonContainer}>
          <Button label="Start Game" variant="primary" onClick={handleStartGame} />
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.title}>Roster</div>
        <Roster players={snapshot?.players ?? []} />
      </div>
    </div>
  );
}