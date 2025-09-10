import React, { useEffect, useRef, useState } from 'react';
import styles from './DrunkWizardSplittingPath.module.css';
import { DrunkWizardSplittingPathDialogue } from '@/constants/dialogue';
import Dialogue1 from '../../general/dialogue_1/Dialogue1';

export default function DrunkWizardSplittingPath() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [stage, setStage] = useState<'playing' | 'fadeToBlack' | 'blackHold' | 'fadeFromBlack' | 'showDialogue'>('playing');
  const [blackOpacity, setBlackOpacity] = useState<number>(0);

  const FADE_MS = 1500;
  const HOLD_MS = 200;

  useEffect(() => {
    if (stage === 'fadeToBlack') {
      requestAnimationFrame(() => setBlackOpacity(1));
      const t = setTimeout(() => setStage('blackHold'), FADE_MS);
      return () => clearTimeout(t);
    }

    if (stage === 'blackHold') {
      const t = setTimeout(() => setStage('fadeFromBlack'), HOLD_MS);
      return () => clearTimeout(t);
    }

    if (stage === 'fadeFromBlack') {
      requestAnimationFrame(() => setBlackOpacity(0));
      const t = setTimeout(() => setStage('showDialogue'), FADE_MS);
      return () => clearTimeout(t);
    }
  }, [stage]);

  const onVideoEnded = () => {
    setStage('fadeToBlack');
  };

  const handleDialogueComplete = () => {
    // Logic to handle when the dialogue is complete, e.g., advance to the next phase
  };

  const overlayClassName = `${styles.overlay} ${blackOpacity > 0 ? styles.overlayActive : ''}`.trim();

  const videoActive = stage === 'playing' || stage === 'fadeToBlack';
  const barsActive = stage === 'playing';
  const topBarClass = `${styles.topBar} ${barsActive ? styles.barActive : ''}`.trim();
  const bottomBarClass = `${styles.bottomBar} ${barsActive ? styles.barActive : ''}`.trim();

  return (
    <div className={styles.container}>
      <div aria-hidden className={topBarClass} />

      {videoActive && (
        <video
          ref={videoRef}
          src="/backgrounds/creepy_forest1.mp4"
          autoPlay
          muted
          playsInline
          onEnded={onVideoEnded}
          className={styles.video}
        />
      )}

      <div
        aria-hidden
        className={overlayClassName}
        style={{ opacity: blackOpacity }}
      />

      <div aria-hidden className={bottomBarClass} />

      {stage === 'showDialogue' && (
        <div className={styles.dialogueWrapper}>
          <Dialogue1 dialogue={DrunkWizardSplittingPathDialogue} onDialogueComplete={handleDialogueComplete} />
        </div>
      )}
    </div>
  );
}