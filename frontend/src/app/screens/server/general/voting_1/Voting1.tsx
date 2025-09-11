"use client";

import React, { useState, useEffect } from 'react';
import Button from '../../../../../components/general/Button';
import Label from '../../../../../components/general/Label';
import styles from './Voting1.module.css';
import { Player, Vote } from '@/client/models';
import { SnapshotContextValue, useSnapshot } from '@/app/state/SnapshotContext';
import { getWinningOption, isVoteConcluded, matchPlayersToOptions, VoteOption, VoteOptionsWithPlayersAndResult } from '@/util/voting';
import DisplayVote from './components/DisplayVote';
import { lobbyClient } from '@/client/api';
import { handleAdvancePhase } from '@/util/util';
import CurtainUp from '../video_effects/CurtainUp';

interface ServerVoting1Props {
  options: VoteOption[];
}

const ServerVoting1: React.FC<ServerVoting1Props> = ({ options }) => {
  const { snapshot }: SnapshotContextValue = useSnapshot();
  const votes: VoteOptionsWithPlayersAndResult[] = matchPlayersToOptions(snapshot, options);
  const voteConcludedBySystem = isVoteConcluded(snapshot);
  const [voteEndedManually, setVoteEndedManually] = useState(false);

  const effectiveVoteEnded = voteConcludedBySystem || voteEndedManually;

  const RESULT_DISPLAY_SECONDS = 3;
  const [countdown, setCountdown] = useState<number>(RESULT_DISPLAY_SECONDS);
  const [showCurtainUp, setShowCurtainUp] = useState(false);
  

  useEffect(() => {
    if (effectiveVoteEnded) {
      setCountdown(RESULT_DISPLAY_SECONDS);
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev < 1) {
            setShowCurtainUp(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [effectiveVoteEnded]);

  const endVoteManually = () => {
    setVoteEndedManually(true);
  }

  return (
    <div className={styles.container}>
      {votes?.find((vote) => vote.score > 0) && !effectiveVoteEnded && (
        <Button className={styles.nextButton} onClick={endVoteManually} label={'Tally votes early'} />
      )}

      {effectiveVoteEnded ? (
        <div className={styles.resultContainer}>
          <DisplayVote vote={getWinningOption(votes)} allVotes={votes} />
          <Label className={styles.label}>
            {`Next screen in ${countdown} second${countdown === 1 ? '' : 's'}...`}
          </Label>
        </div>
      ) : (
        <>
          {votes.map((vote: VoteOptionsWithPlayersAndResult, index) => (
            <DisplayVote key={index} vote={vote} allVotes={votes} />
          ))}
        </>
      )}
      {showCurtainUp && (
        <CurtainUp onEffectEnded={handleAdvancePhase} />
      )}
    </div>
  );
};

export default ServerVoting1;