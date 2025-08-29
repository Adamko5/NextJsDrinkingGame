"use client";

import React, { useState } from 'react';
import Button from '../../../../components/general/Button';
import styles from './Voting1.module.css';

/**
 * Helper that would send a vote to the backend.  In this stub
 * implementation we simply log to the console and return true.
 */
function sendVote(payload: { answer: 'yes' | 'no' | null }): boolean {
  console.log('[Voting1] sending vote', payload);
  // TODO: integrate with backend via fetch or other API
  return true;
}

/**
 * The first voting screen for players.  Displays a simple yes/no
 * prompt along with two buttons.  The user’s selection is
 * highlighted and subsequent taps update the selection.  When a
 * vote is submitted it is sent via the helper above.
 */
export default function ClientVoting1() {
  const [selected, setSelected] = useState<'yes' | 'no' | null>(null);

  function handleVote(answer: 'yes' | 'no') {
    setSelected(answer);
    // Persist the vote immediately to avoid double taps or stale state
    sendVote({ answer });
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.title}>Cast your vote</div>
        <div className={styles.subtitle}>Tap to choose Yes or No</div>
        <div className={styles.buttons}>
          <Button
            label="YES"
            variant={selected === 'yes' ? 'primary' : 'secondary'}
            className={styles.voteButton}
            onClick={() => handleVote('yes')}
          />
          <Button
            label="NO"
            variant={selected === 'no' ? 'primary' : 'secondary'}
            className={styles.voteButton}
            onClick={() => handleVote('no')}
          />
        </div>
      </div>
    </div>
  );
}