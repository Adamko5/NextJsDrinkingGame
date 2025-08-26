"use client";

import React from 'react';

interface PlayerRow {
  id: string;
  name: string;
  trait?: string;
  connected: boolean;
}

type VotingMode = 'player' | 'binary';

interface DisplayVotesProps {
  /**
   * List of players. Used to resolve vote targets by id and to preserve
   * ordering when displaying votes.
   */
  players: PlayerRow[];
  /**
   * Optional mapping of playerId → vote. When provided, DisplayVotes will
   * render these votes verbatim instead of maintaining its own local
   * state. The vote value may be a string ('yes'/'no' or target playerId)
   * or an object with an `answer` field for binary votes.
   */
  votes?: Record<string, any>;
  /**
   * Which type of vote is being displayed. In 'binary' mode the vote is
   * interpreted as yes/no; in 'player' mode the vote is interpreted as
   * another player's id. Defaults to 'player'.
   */
  initialMode?: VotingMode;
}

/**
 * Display a table of votes for each player. When a `votes` prop is provided
 * the component simply renders the passed values; otherwise it falls back
 * to showing a dash for missing votes. This simple presentation makes it
 * clear who voted for whom without attempting any random assignment.
 */
export default function DisplayVotes({ players, votes = {}, initialMode = 'player' }: DisplayVotesProps) {
  const mode: VotingMode = initialMode;

  return (
    <div>
      {players.map((p) => {
        const raw = votes[p.id];
        let display: React.ReactNode = '—';
        if (raw) {
          if (mode === 'binary') {
            // Support both { answer: 'yes' } and 'yes' strings
            const ans = typeof raw === 'object' && raw.answer ? raw.answer : raw;
            if (ans === 'yes') {
              display = '✓';
            } else if (ans === 'no') {
              display = '✕';
            } else {
              display = String(ans);
            }
          } else {
            // player mode: the vote refers to another player's id
            const target = players.find((t) => t.id === raw);
            display = target ? target.name : String(raw);
          }
        }
        return (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: 'bold', marginRight: '8px' }}>{p.name}:</span>
            <span>{display}</span>
          </div>
        );
      })}
    </div>
  );
}