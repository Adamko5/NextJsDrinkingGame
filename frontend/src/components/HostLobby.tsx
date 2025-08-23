"use client";

import React, { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Roster from './Roster';
import { setupHostSocket } from '../lib/wsClient';

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
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '1rem' }}>Lobby Code: {lobbyCode}</h1>
      <p>LAN IP: {lanIp}</p>
      <p>Join URL:</p>
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{joinUrl}</pre>
      <div style={{ margin: '1rem auto', width: 256, height: 256 }}>
        <QRCodeSVG value={joinUrl} size={256} />
      </div>
      <h2>Players</h2>
      <Roster players={roster} />
      <button
        style={{ marginTop: '1rem', padding: '0.5rem 1rem', fontSize: '1rem' }}
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