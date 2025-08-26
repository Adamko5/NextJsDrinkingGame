"use client";

import React, { useEffect, useState } from 'react';
import { setupHostSocket } from '../lib/wsClient';
import Roster from '../components/Roster';
import DisplayVotes from '../components/DisplayVotes';

interface PlayerRow {
  id: string;
  name: string;
  trait?: string;
  connected: boolean;
}

interface Screen1Props {
  initialPlayers?: PlayerRow[];
  initialVotes?: Record<string, any>;
}

/**
 * Host display for phase 1. Shows the current roster and any votes cast by
 * players in real time. On mount the component opens a WebSocket and
 * subscribes to roster and vote updates. When the WebSocket closes the
 * subscription is cleaned up automatically.
 */
export default function Screen1({ initialPlayers = [], initialVotes = {} }: Screen1Props) {
  const [players, setPlayers] = useState<PlayerRow[]>(initialPlayers);
  const [votes, setVotes] = useState<Record<string, any>>(initialVotes);

  useEffect(() => {
    // Subscribe to roster, phase and vote updates. We ignore PHASE here
    // because this screen only renders phase 1; other phases will navigate
    // away via HostLobby.
    const ws = setupHostSocket(
      (newRoster) => setPlayers(newRoster),
      undefined,
      (newVotes) => setVotes(newVotes),
    );
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <h2>Votes</h2>
      <div style={{ marginBottom: '16px' }}>
        <Roster players={players} />
      </div>
      <DisplayVotes players={players} votes={votes} initialMode="binary" />
    </div>
  );
}