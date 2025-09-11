import React, { useState } from 'react';
import styles from './DrunkWizardSplittingPath.module.css';
import { DrunkWizardSplittingPathDialogue2 } from '@/constants/dialogue';
import Dialogue1 from '../../general/dialogue_1/Dialogue1';
import { handleAdvancePhase } from '@/util/util';
import CurtainDown from '../../general/video_effects/CurtainDown';

export default function DrunkWizardSplittingPath2() {
  const [showDialogue, setShowDialogue] = useState(false);

  const FADE_MS = 1000;
  const HOLD_MS = 0;

  const onEffectEnded = () => {
    setTimeout(() => setShowDialogue(true), FADE_MS + HOLD_MS);
  };

  const handleDialogueComplete = () => {
    handleAdvancePhase();
  };

  return (
    <div className={styles.container}>
      <CurtainDown onEffectEnded={onEffectEnded} fadeMs={FADE_MS} holdMs={HOLD_MS} />

      {showDialogue && (
        <div className={styles.dialogueWrapper}>
          <Dialogue1 dialogue={DrunkWizardSplittingPathDialogue2} onDialogueComplete={handleDialogueComplete} />
        </div>
      )}
    </div>
  );
}