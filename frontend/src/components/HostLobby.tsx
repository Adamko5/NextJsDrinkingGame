"use client";

import React, { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Roster from './Roster';
import { setupHostSocket } from '../lib/wsClient';
import styles from './HostLobby.module.css';

interface HostLobbyProps {
  lobbyCode: string;
  joinUrl: string;
  initialRoster: { id: string; name: string; trait?: string; connected: boolean }[];
  lanIp: string;
}

/**
 * Client component for the host screen. It receives initial values from the
 * server and establishes a WebSocket connection when mounted. The roster
 * updates in real time as players join or disconnect. A disabled Start
 * button is shown until at least one player has connected.
 */
export default function HostLobby({ lobbyCode, joinUrl, initialRoster, lanIp }: HostLobbyProps) {
  const [roster, setRoster] = useState(initialRoster);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Open a WebSocket connection to subscribe to roster updates. The host
    // does not send any messages; the server will broadcast ROSTER changes.
    wsRef.current = setupHostSocket((newRoster) => {
      setRoster(newRoster);
    });
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.code}>Lobby {lobbyCode}</div>
      <pre className={styles.joinUrl}>{joinUrl}</pre>
      <div className={styles.qrWrapper}>
        <QRCodeSVG value={joinUrl} size={256} />
      </div>
      <div className={styles.playersTitle}>Players</div>
      <div className={styles.playersArea}>
        <Roster players={roster} />
      </div>
      <button
        className={styles.startButton}
        disabled={roster.filter((p) => p.connected).length === 0}
        onClick={() => {
          if (!wsRef.current) return;
          try {
            wsRef.current.send(
              JSON.stringify({ type: 'START', lobbyCode }),
            );
          } catch {
            // ignore
          }
        }}
      >
        Start
      </button>
    </div>
  );
}