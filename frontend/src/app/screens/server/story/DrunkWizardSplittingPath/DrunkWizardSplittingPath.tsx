import React, { useState } from 'react';
import styles from './DrunkWizardSplittingPath.module.css';
import { DrunkWizardSplittingPathDialogue } from '@/constants/dialogue';
import Dialogue1 from '../../general/dialogue_1/Dialogue1';
import VideoPlayer from '../../general/video_effects/VideoPlayer';
import CurtainUp from '../../general/video_effects/CurtainUp';
import { handleAdvancePhase } from '@/util/util';

export default function DrunkWizardSplittingPath() {
  const [showDialogue, setShowDialogue] = useState(false);
  const [showCurtainUp, setShowCurtainUp] = useState(false);

  const FADE_MS = 1500;
  const HOLD_MS = 200;

  const onVideoEnded = () => {
    setTimeout(() => setShowDialogue(true), FADE_MS + HOLD_MS + FADE_MS);
  };

  const handleDialogueComplete = () => {
    setShowCurtainUp(true);
    setShowDialogue(false);
  };

  const onCurtainEffectEnded = () => {
    handleAdvancePhase();
  }

  return (
    <div className={styles.container}>
      <VideoPlayer src="/videos/creepy_forest1.mp4" onVideoEnded={onVideoEnded} fadeMs={FADE_MS} holdMs={HOLD_MS} />

      {showDialogue && (
        <div className={styles.dialogueWrapper}>
          <Dialogue1 dialogue={DrunkWizardSplittingPathDialogue} onDialogueComplete={handleDialogueComplete} />
        </div>
      )}

      {showCurtainUp && (
        <CurtainUp fadeMs={FADE_MS} holdMs={HOLD_MS} onEffectEnded={onCurtainEffectEnded} />
      )}

      
    </div>
  );
}