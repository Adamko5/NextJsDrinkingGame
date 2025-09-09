"use client";

import React, { useEffect, useState } from 'react';
import styles from './StoryTelling.module.css';
import DisplayStoryLine from './components/DisplayStoryLine';
import Button from '@/components/general/Button';
import { lobbyClient } from '@/client/api';
import { StoryLine } from '../models/StoryLineModels';

export interface StoryTellingProps {
  inputStory: StoryLine[];
}

var story: StoryLine[] = [];

const StoryTelling1: React.FC<StoryTellingProps>= ({ inputStory }) =>{
  story = inputStory;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (currentIndex >= story.length) {
      return;
    }
    const duration = story[currentIndex].screenTime;
    const timer = setTimeout(() => {
      if (currentIndex >= story.length - 1) return;

      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      if (nextIndex === story.length - 1) {
        setShowButton(true);
      }
    }, duration);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handleStartVoting = async () => {
    try {
      await lobbyClient.advancePhase();
    } catch (error) {
      console.error('Failed to advance phase:', error);
    }
  };

  return (
    <div className={styles.container}>
      <DisplayStoryLine storyLine={story[currentIndex]} />

      {showButton && (
        <div className={styles.buttonContainer}>
          <Button label="Continue" onClick={handleStartVoting} />
        </div>
      )}
    </div>
  );
}

export default StoryTelling1;