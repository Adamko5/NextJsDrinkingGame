"use client";

import React from 'react';
import Button from '../../../../../components/general/Button';
import Label from '../../../../../components/general/Label';
import styles from './Voting1.module.css';
import { Player, Vote } from '@/client/models';
import { SnapshotContextValue, useSnapshot } from '@/app/state/SnapshotContext';
import { matchPlayersToOptions, VoteOption, VoteOptionsWithPlayersAndResult } from '@/util/voting';
import DisplayVote from './components/DisplayVote';

interface ServerVoting1Props {
  options: VoteOption[];
}

const ServerVoting1: React.FC<ServerVoting1Props> = ({ options }) => {
  const { snapshot }: SnapshotContextValue = useSnapshot();
  const votes: VoteOptionsWithPlayersAndResult[] = matchPlayersToOptions(snapshot, options);

  const nextScreen = () => {
    console.log("next");
  }

  return (
    <div className={styles.container}>
      { votes?.find((vote) => vote.score > 0) && (
        <Button className={styles.nextButton} onClick={nextScreen} label={'Tally votes early'} />
      )}
      {votes.map((vote: VoteOptionsWithPlayersAndResult, index) => (
        <DisplayVote vote={vote} allVotes={votes} ></DisplayVote>
      ))}
    </div>
  );
};

export default ServerVoting1;