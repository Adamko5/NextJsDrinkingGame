"use client";

import React from 'react';

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
  return (
    <ul style={{ listStyleType: 'none', padding: 0 }}>
      {players.map((player) => (
        <li key={player.id} style={{ margin: '0.25rem 0', display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '0.5rem' }}>{player.connected ? '🟢' : '⚪️'}</span>
          <span>{player.name}</span>
          {player.trait && <span style={{ marginLeft: '0.5rem', color: '#666' }}>({player.trait})</span>}
        </li>
      ))}
    </ul>
  );
}