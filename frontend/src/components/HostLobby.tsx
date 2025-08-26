"use client";

import React, { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Roster from './Roster';
import { useRouter } from 'next/navigation';
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
 * updates in real time as players join or disconnect. When the host
 * presses Start the server will broadcast a PHASE message causing this
 * component to swap to the first screen.
 */
export default function HostLobby({ lobbyCode, joinUrl, initialRoster, lanIp }: HostLobbyProps) {
  const [roster, setRoster] = useState(initialRoster);
  const router = useRouter();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Open a WebSocket connection to subscribe to roster and phase updates.
    wsRef.current = setupHostSocket(
      (newRoster) => {
        setRoster(newRoster);
      },
      (phaseName) => {
        // When the server indicates a phase change, navigate to the
        // corresponding server-side route if appropriate. For phase 1
        // we redirect the host to /server/1 which renders the phase page.
        try {
          const id = String(phaseName);
          if (id === '1') {
            router.push('/server/1');
          }
        } catch {
          // ignore malformed phase
        }
      },
    );
    return () => {
      wsRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // PhaseRenderer will render the appropriate phase screen for the server
  // (or the children when the phase has no server-visible screen).

  const handleStart = () => {
    if (!wsRef.current) return;
    try {
      wsRef.current.send(
        JSON.stringify({ type: 'START', lobbyCode }),
      );
    } catch {
      // ignore
    }
  };

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
          onClick={handleStart}
        >
          Start
        </button>
      </div>
  );
}