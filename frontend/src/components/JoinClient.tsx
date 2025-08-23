"use client";

import React, { useEffect, useRef, useState } from 'react';
import { createClientSocket } from '../lib/wsClient';
import { getRejoinKey, setRejoinKey } from '../lib/storage';

interface JoinClientProps {
  initialLobbyCode: string;
}

/**
 * Client component used on the phone to join a lobby. It maintains local
 * state for the form fields and uses localStorage to persist the rejoinKey
 * and cached inputs across reloads. When the user presses Join a WebSocket
 * connection is opened and a JOIN message is sent. The UI transitions to
 * a waiting state until the host starts the game.
 */
export default function JoinClient({ initialLobbyCode }: JoinClientProps) {
  const [lobbyCode, setLobbyCode] = useState(() => initialLobbyCode);
  const [name, setName] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cachedName') || '';
    }
    return '';
  });
  const [trait, setTrait] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cachedTrait') || '';
    }
    return '';
  });
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Persist inputs to localStorage so a refresh doesn’t wipe them
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cachedName', name);
  }, [name]);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cachedTrait', trait);
  }, [trait]);

  const handleJoin = () => {
    setError(null);
    if (!lobbyCode || lobbyCode.length < 1) {
      setError('Please enter a lobby code.');
      return;
    }
    if (!name || name.trim().length === 0) {
      setError('Please enter your name.');
      return;
    }
    const rejoinKey = getRejoinKey();
    const socket = createClientSocket({
      lobbyCode: lobbyCode.toUpperCase(),
      name: name.trim(),
      trait: trait.trim() || undefined,
      rejoinKey: rejoinKey || undefined,
      onRoster: () => {
        /* roster updates are not currently displayed on the phone */
      },
      onJoinOk: (resp) => {
        setRejoinKey(resp.playerKey);
        setJoined(true);
      },
      onError: (msg) => {
        setError(msg);
      },
    });
    wsRef.current = socket;
  };

  // Close the socket when navigating away
  useEffect(() => {
    return () => {
      wsRef.current?.close();
    };
  }, []);

  if (joined) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Joined lobby {lobbyCode.toUpperCase()}</h1>
        <p>Waiting for host…</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Join Lobby</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="lobby" style={{ display: 'block', marginBottom: '0.25rem' }}>Lobby Code</label>
        <input
          id="lobby"
          type="text"
          value={lobbyCode}
          onChange={(e) => setLobbyCode(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="name" style={{ display: 'block', marginBottom: '0.25rem' }}>Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="trait" style={{ display: 'block', marginBottom: '0.25rem' }}>Trait (optional)</label>
        <input
          id="trait"
          type="text"
          value={trait}
          onChange={(e) => setTrait(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
        />
      </div>
      <button
        type="button"
        onClick={handleJoin}
        style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}
      >
        Join
      </button>
    </div>
  );
}