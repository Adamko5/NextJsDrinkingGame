"use client";

import React from 'react';
import styles from './DisplayVotes.module.css';
import { getClassById } from '../lib/classes';

interface PlayerRow {
  id: string;
  name: string;
  trait?: string;
  connected: boolean;
}

type VotingMode = 'player' | 'binary';

export default function DisplayVotes({ players, initialMode = 'player' }: { players: PlayerRow[]; initialMode?: VotingMode }) {
  // votes: for 'player' mode store target playerId (string), for 'binary' store 'yes'|'no' or ''
  const [votes, setVotes] = React.useState<Record<string, string>>({});
  const [mode, setMode] = React.useState<VotingMode>(initialMode);

  React.useEffect(() => {
    // Ensure votes object has keys for every player
    setVotes((cur) => {
      const next = { ...cur };
      let changed = false;
      players.forEach((p) => {
        if (!(p.id in next)) {
          next[p.id] = '';
          changed = true;
        }
      });
      return changed ? next : cur;
    });
  }, [players]);

  function assignRandomVotes() {
    if (mode === 'binary') {
      const opts = ['yes', 'no'];
      const next: Record<string, string> = {};
      players.forEach((p) => {
        next[p.id] = opts[Math.floor(Math.random() * opts.length)];
      });
      setVotes(next);
      return;
    }

    // player mode: pick a random other player as the vote target
    const next: Record<string, string> = {};
    players.forEach((p) => {
      if (players.length <= 1) {
        next[p.id] = '';
        return;
      }
      let target: PlayerRow | undefined;
      while (!target) {
        const cand = players[Math.floor(Math.random() * players.length)];
        if (cand.id !== p.id) target = cand;
      }
      next[p.id] = target.id;
    });
    setVotes(next);
  }

  function renderPlayerAvatarFor(player: PlayerRow) {
    const cls = player.trait ? getClassById(player.trait) : undefined;
    if (cls) {
      return <div className={styles.smallAvatar} style={{ backgroundImage: `url(${cls.imageSrc})` }} />;
    }
    // fallback: initials
    const initials = player.name.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();
    return <div className={styles.smallAvatarFallback}>{initials}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <button className={styles.randomBtn} onClick={assignRandomVotes}>Assign random votes</button>
      </div>

      <ul className={styles.list}>
        {players.map((p) => {
          const vote = votes[p.id];
          return (
            <li key={p.id} className={styles.item}>
              <div className={styles.playerInfo}>
                {renderPlayerAvatarFor(p)}
                <div className={styles.playerName}>{p.name}</div>
              </div>

              <div className={styles.voteArea}>
                {mode === 'binary' ? (
                  vote === 'yes' ? (
                    <span className={styles.yes}>✓</span>
                  ) : vote === 'no' ? (
                    <span className={styles.no}>✕</span>
                  ) : (
                    <span className={styles.empty}>—</span>
                  )
                ) : (
                  // player mode: show the chosen player's avatar + name
                  (() => {
                    if (!vote) return <span className={styles.empty}>—</span>;
                    const target = players.find((t) => t.id === vote);
                    if (!target) return <span className={styles.empty}>Unknown</span>;
                    const cls = target.trait ? getClassById(target.trait) : undefined;
                    return (
                      <div className={styles.chosenTarget}>
                        {cls ? (
                          <div className={styles.targetAvatar} style={{ backgroundImage: `url(${cls.imageSrc})` }} />
                        ) : (
                          <div className={styles.targetAvatarFallback}>{target.name.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase()}</div>
                        )}
                        <div className={styles.targetName}>{target.name}</div>
                      </div>
                    );
                  })()
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
