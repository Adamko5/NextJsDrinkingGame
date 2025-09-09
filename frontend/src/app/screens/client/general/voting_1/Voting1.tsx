"use client";

import React, { useState } from 'react';
import Button from '../../../../../components/general/Button';
import Label from '../../../../../components/general/Label';
import styles from './Voting1.module.css';
import { VoteOption } from '@/app/screens/general/voting/Intro';
import { CookieTool } from '@/app/state/CookieTool';
import { voteClient } from '@/client/api';

interface ClientVoting1Props {
  options: VoteOption[];
}

const ClientVoting1: React.FC<ClientVoting1Props> = ({ options }) => {
  const [selectedVoteIndex, setSelectedVoteIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSelect = (index: number) => {
    setSelectedVoteIndex(index);
  };

  const handleSubmitVote = async () => {
    if (selectedVoteIndex === null) {
      alert('Please select a vote option first!');
      return;
    }
    const currentPlayerKey = CookieTool.getCurrentPlayerKey();
    console.log('Current Player Key:', currentPlayerKey);
    if (!currentPlayerKey) {
      alert('Player not found. Please log in again.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Here we assume that the vote for the selected option is identified by its text.
      // You can adjust the payload to include binary or forPlayer if needed.
      const vote = await voteClient.addVote({
        byPlayer: currentPlayerKey,
        forOption: options[selectedVoteIndex].text
      });
    } catch (err: any) {
      console.error('Error submitting vote:', err);
      alert(err.message || 'Failed to submit vote.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.voteOptions}>
        {options.map((option, index) => (
          <div
            key={index}
            className={`${styles.voteOption} ${selectedVoteIndex === index ? styles.selected : ''}`}
            onClick={() => handleSelect(index)}
          >
            <Label className={styles.label}>{option.text}</Label>
          </div>
        ))}
      </div>
      <div>
        <Button 
          label={'Submit Vote'} 
          onClick={handleSubmitVote} 
          disabled={isSubmitting || selectedVoteIndex === null}
        />
      </div>
    </div>
  );
};

export default ClientVoting1;