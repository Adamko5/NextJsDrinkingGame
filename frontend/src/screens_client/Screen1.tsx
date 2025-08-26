"use client";

import React from 'react';
import styles from './Screen1.module.css';
import { sendVote } from '../lib/wsClient';

export default function Screen1() {
  const [selected, setSelected] = React.useState<'yes'|'no'|null>(null);

  function submit(answer?: 'yes' | 'no' | null) {
    // Use the explicit answer when provided to avoid reading stale state
    // immediately after calling setSelected. Also update the local state
    // so the UI reflects the chosen option.
    const ans = typeof answer === 'undefined' ? selected : answer;
    setSelected(ans);
    // Send a structured VOTE message to the server. Use the helper for
    // consistent logging and safe delivery.
    const payload = { answer: ans };
    const ok = sendVote(payload);
    if (ok) {
      console.log('[Screen1] vote sent', payload);
    } else {
      console.warn('[Screen1] vote NOT sent (socket closed)', payload);
    }
  }

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.title}>Cast your vote</div>
        <div className={styles.subtitle}>Tap to choose Yes or No</div>
      </div>

      <div className={styles.buttons}>
        <button
          className={`${styles.btn} ${styles.yes} ${selected === 'yes' ? styles.selected : ''}`}
          onClick={() => submit('yes')}
        >
          YES
        </button>

        <button
          className={`${styles.btn} ${styles.no} ${selected === 'no' ? styles.selected : ''}`}
          onClick={() => submit('no')}
        >
          NO
        </button>
      </div>
    </div>
  );
}
