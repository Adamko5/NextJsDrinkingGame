import React, { useState } from 'react';
import styles from './DrunkWizardSplittingPath.module.css';
import { DrunkWizardSplittingPathDialogue2 } from '@/constants/dialogue';
import Dialogue1 from '../../general/dialogue_1/Dialogue1';
import { handleAdvancePhase } from '@/util/util';
import CurtainDown from '../../general/video_effects/CurtainDown';
import CurtainUp from '../../general/video_effects/CurtainUp';

export default function DrunkWizardSplittingPath2() {
  const [showDialogue, setShowDialogue] = useState(false);

  const FADE_MS = 1000;
  const HOLD_MS = 0;

  const onEffectEnded = () => {
    setTimeout(() => setShowDialogue(true), FADE_MS + HOLD_MS);
  };

  const [showCurtainUp, setShowCurtainUp] = useState(false);
  
  const handleCurtainUp = () => {
    setShowCurtainUp(true);
  };

  return (
    <div className={styles.container}>
      <CurtainDown onEffectEnded={onEffectEnded} fadeMs={FADE_MS} holdMs={HOLD_MS} />

      {showDialogue && (
        <div className={styles.dialogueWrapper}>
          <Dialogue1 dialogue={DrunkWizardSplittingPathDialogue2} onDialogueComplete={handleCurtainUp} />
        </div>
      )}

      {showCurtainUp && (
        <CurtainUp fadeMs={FADE_MS} holdMs={HOLD_MS} onEffectEnded={handleAdvancePhase} />
      )}
    </div>
  );
}