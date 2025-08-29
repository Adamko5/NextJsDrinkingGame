"use client";

import React, { useEffect, useState } from 'react';
import HostLobby from './components/HostLobby';
import Roster from './components/Roster';
import styles from './Home.module.css';
import { SnapshotContextValue, useSnapshot } from '../../../state/SnapshotContext';
import { pickLanIp } from '@/util/ip-picker';

/**
 * The server home page displayed on the TV.  It shows the join
 * information (QR code and URL) along with a real‑time roster of
 * players who have joined the lobby.  The snapshot is obtained from
 * the SnapshotProvider via the `useSnapshot` hook.
 */
export default function ServerHomePage() {
  // Pull the current snapshot from context.  Destructure snapshot to
  // access the list of players; ignore error/refresh for now.
  const { snapshot } : SnapshotContextValue = useSnapshot();

  // Construct the join URL based on the current host and port.
  const [joinUrl, setJoinUrl] = useState('');

  useEffect(() => {
    // Determine the hostname from the browser context if available.
    const host = pickLanIp();
    console.log("Picked LAN IP:", host);
    const port = process.env.PORT || '8081';
    setJoinUrl(`http://${host}:${port}/client`);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <HostLobby joinUrl={joinUrl} />
      </div>
      <div className={styles.section}>
        <div className={styles.title}>Roster</div>
        <Roster players={snapshot?.players ?? []} />
      </div>
    </div>
  );
}