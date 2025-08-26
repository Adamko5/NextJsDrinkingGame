"use client";

import React, { useEffect, useRef, useState } from 'react';
import styles from './JoinClient.module.css';
import { createClientSocket } from '../lib/wsClient';
import { getRejoinKey, setRejoinKey } from '../lib/storage';
import { classes } from '../lib/classes';
import Screen1 from '../screens_client/Screen1';

interface JoinClientProps {
  /**
   * The lobby code extracted from the URL on initial render. If present the
   * input field is prefilled so players don't need to type it manually.
   */
  initialLobbyCode: string;
}

/**
 * The phone join screen. Users can enter a lobby code, pick a class and
 * join the game. When joined the UI switches to a waiting state until
 * the host starts the game, at which point the first game screen is shown.
 * We avoid routing away from this page so that the WebSocket remains open.
 */
export default function JoinClient({ initialLobbyCode }: JoinClientProps) {
  // Form fields are cached in localStorage so reloads retain their values.
  const [lobbyCode, setLobbyCode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cachedLobbyCode') || initialLobbyCode || '';
    }
    return initialLobbyCode || '';
  });
  const [name, setName] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cachedName') || '';
    }
    return '';
  });
  const [classId, setClassId] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cachedClassId') || classes[0].id;
    }
    return classes[0].id;
  });

  const [joined, setJoined] = useState(false);
  const [phase, setPhase] = useState<string>('lobby');
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<{ attempt: number; timer: NodeJS.Timeout | null }>({
    attempt: 0,
    timer: null,
  });

  // Persist inputs to localStorage so a refresh doesn’t wipe them
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cachedName', name);
  }, [name]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cachedClassId', classId);
  }, [classId]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('cachedLobbyCode', lobbyCode);
    } catch {
      // ignore
    }
  }, [lobbyCode]);

  /**
   * Attempt to join the lobby. On open the client socket sends a JOIN
   * message; on success the server responds with JOIN_OK and we record
   * the playerKey. Reconnection with exponential backoff is triggered
   * when the socket closes unexpectedly.
   */
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
    const connect = () => {
      const socket = createClientSocket({
        lobbyCode: lobbyCode.toUpperCase(),
        name: name.trim(),
        trait: classId,
        rejoinKey: rejoinKey || undefined,
        onRoster: () => {
          /* roster updates are not displayed on the phone */
        },
        onJoinOk: (resp) => {
          setRejoinKey(resp.playerKey);
          setJoined(true);
        },
        onPhase: (phaseName) => {
          if (phaseName) {
            setPhase(String(phaseName));
          }
        },
        onError: (msg) => {
          setError(msg);
        },
      });
      socket.onclose = () => {
        // attempt reconnection with exponential backoff
        const { attempt } = reconnectRef.current;
        const delay = Math.min(500 * 2 ** attempt, 10_000);
        reconnectRef.current.timer = setTimeout(() => {
          reconnectRef.current.attempt = attempt + 1;
          connect();
        }, delay);
      };
      wsRef.current = socket;
    };
    // initiate first connection
    connect();
  };

  // Close the socket when navigating away
  useEffect(() => {
    return () => {
      wsRef.current?.close();
      if (reconnectRef.current.timer) {
        clearTimeout(reconnectRef.current.timer);
      }
    };
  }, []);

  // Automatically join on first mount if we have a rejoinKey and a lobby code.
  // Do NOT re‑run when `lobbyCode` changes to avoid auto‑joining while the
  // user is typing.
  useEffect(() => {
    if (!joined) {
      const rejoin = getRejoinKey();
      if (rejoin && lobbyCode) {
        handleJoin();
      }
    }
    // We intentionally omit handleJoin from deps to avoid infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Once joined and the phase has advanced, render the appropriate game screen.
  if (joined && phase === '1') {
    // When phase 1 begins on the server, render the client voting screen. We
    // intentionally stay on the same page so that the WebSocket remains open.
    return <Screen1 />;
  }

  // Joined but still in lobby/other phase: show waiting state
  if (joined) {
    return (
      <div className={styles.waitingContainer}>
        <div className={styles.waitingOverlay}>
          <div>Joined lobby {lobbyCode.toUpperCase()}</div>
          <div>Waiting for host…</div>
        </div>
      </div>
    );
  }

  // Otherwise show the join form
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Join Lobby</h1>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.formGroup}>
        <label htmlFor="lobby" className={styles.label}>
          Lobby Code
        </label>
        <input
          id="lobby"
          type="text"
          value={lobbyCode}
          onChange={(e) => setLobbyCode(e.target.value)}
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Class</label>
        <select
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className={styles.input}
        >
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleJoin} className={styles.button}>
        Join
      </button>
    </div>
  );
}