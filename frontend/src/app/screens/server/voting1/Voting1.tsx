"use client";

import React, { useEffect, useState } from 'react';
import Button from '../../../../components/general/Button';
import styles from './Voting1.module.css';

interface VoteTally {
  yes: number;
  no: number;
}

/**
 * Server view of the first voting phase.  It displays aggregated
 * vote counts and progress bars indicating the percentage of yes/no
 * votes.  A Next button allows the host to advance to the next
 * phase.  In a production implementation the tallies would be
 * updated in real time from the backend.  Here we simulate
 * incoming results.
 */
export default function ServerVoting1() {
  const [tally, setTally] = useState<VoteTally>({ yes: 0, no: 0 });

  useEffect(() => {
    // Simulate incoming votes to demonstrate the progress bars.  This
    // effect updates the tally once after a short delay.
    const timer = setTimeout(() => {
      setTally({ yes: 4, no: 1 });
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const total = tally.yes + tally.no || 1;
  const yesPercent = (tally.yes / total) * 100;
  const noPercent = (tally.no / total) * 100;

  function handleNext() {
    // TODO: instruct backend to advance to the next phase
    console.log('[ServerVoting1] advancing to next phase');
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.title}>Vote results</div>
        <div className={styles.barContainer}>
          <div>
            <div className={styles.barLabel}>Yes ({tally.yes})</div>
            <div className={styles.bar}>
              <div
                className={styles.barFill}
                style={{ width: `${yesPercent}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className={styles.barLabel}>No ({tally.no})</div>
            <div className={styles.bar}>
              <div
                className={styles.barFill}
                style={{ width: `${noPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          <Button label="Next" onClick={handleNext} />
        </div>
      </div>
    </div>
  );
}