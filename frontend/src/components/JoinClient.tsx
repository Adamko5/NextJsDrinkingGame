"use client";

import React, { useEffect, useRef, useState } from 'react';
import { createClientSocket } from '../lib/wsClient';
import { getRejoinKey, setRejoinKey } from '../lib/storage';
import { classes } from '../lib/classes';
import ClassPicker from './ClassPicker';
import { useRouter } from 'next/navigation';
import styles from './JoinClient.module.css';

interface JoinClientProps {
  initialLobbyCode: string;
}

/**
 * The phone join screen. Users can enter a lobby code, pick a class and
 * join the game. When joined the UI switches to a waiting state until
 * the host starts the game, at which point the first game screen is shown.
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
  const [phase, setPhase] = useState<'lobby' | string>('lobby');
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<{ attempt: number; timer: NodeJS.Timeout | null }>({
    attempt: 0,
    timer: null,
  });
  const [clockOffset, setClockOffset] = useState<number>(0);

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
   * Called when the user presses Join. This function opens a WebSocket,
   * sends a JOIN message and registers callbacks for roster, join, phase
   * and error events. It also handles reconnection with exponential
   * backoff if the socket closes unexpectedly.
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
          // compute clock offset relative to server
          if (resp.snapshot && typeof resp.snapshot.serverNow === 'number') {
            setClockOffset(Date.now() - resp.snapshot.serverNow);
          }
        },
        onPhase: (phaseName) => {
          if (phaseName) {
            const id = String(phaseName);
            setPhase(id as any);
            if (id === '1') {
              // Navigate to client phase 1 page. Keep the client route mounted
              // per README guidance; if you prefer not to navigate, we can
              // instead render inline state. For now, route to /client/1.
              router.push('/client/1');
            }
          }
        },
        onError: (msg) => {
          setError(msg);
        },
      });
      socket.onclose = () => {
        // attempt reconnection with exponential backoff
        const { attempt } = reconnectRef.current;
        const delay = Math.min(500 * 2 ** attempt, 10000);
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
  // Do NOT re-run when `lobbyCode` changes to avoid auto-joining while the
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

  if (joined) {
    const selected = classes.find((c) => c.id === classId) || classes[0];
    return (
      <div className={styles.waitingContainer}>
        <div className={styles.waitingOverlay}>
          <div>Joined lobby {lobbyCode.toUpperCase()}</div>
          <div>Waiting for host…</div>
        </div>
        <div className={styles.selectedCard}>
          <div
            className={styles.selectedImage}
            style={{ backgroundImage: `url(${selected.imageSrc})` }}
            aria-hidden
          />
          <div className={styles.selectedInfo}>
            <h1 className={styles.selectedName}>{selected.name}</h1>
            <p className={styles.selectedDescription}>{selected.description}</p>
          </div>
        </div>
      </div>
    );
  }

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
        <ClassPicker selectedId={classId} onChange={setClassId} />
      </div>
      <button type="button" onClick={handleJoin} className={styles.button}>
        Join
      </button>
    </div>
  );
}