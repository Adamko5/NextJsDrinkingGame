"use client";

import React from 'react';
import Button from '../../../../../components/general/Button';
import Label from '../../../../../components/general/Label';
import styles from './Voting1.module.css';
import { VoteOption } from '@/app/screens/general/voting/Intro';
import { Player, Vote } from '@/client/models';
import { SnapshotContextValue, useSnapshot } from '@/app/state/SnapshotContext';

// const { snapshot }: SnapshotContextValue = useSnapshot();
// THIS FUCKING LINE SOMEHOW CAUSES AN ERROR????

interface ServerVoting1Props {
  options: VoteOption[];
}

const ServerVoting1: React.FC<ServerVoting1Props> = ({ options }) => {
  return (
    <div className={styles.container}>
      {options.map((option, index) => (
        <div
          key={index}
          className={styles.voteOption}
          style={{
            left: `${option.position.x}%`,
            top: `${option.position.y}%`
          }}
        >
          <Label className={styles.label}>{option.text}</Label>
        </div>
      ))}
    </div>
  );
};

export default ServerVoting1;