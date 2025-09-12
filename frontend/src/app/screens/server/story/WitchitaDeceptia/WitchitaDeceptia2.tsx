import React, { useState } from 'react';
import styles from './WitchitaDeceptia2.module.css';
import CurtainUp from '../../general/video_effects/CurtainUp';
import { handleAdvancePhase } from '@/util/util';
import CurtainDown from '../../general/video_effects/CurtainDown';
import Label from '@/components/general/Label';
import { SnapshotContextValue, useSnapshot } from '@/app/state/SnapshotContext';
import { getPlayersFromVoteKeys } from '@/util/voting';
import Roster from '../../home/components/Roster';
import Button from '@/components/general/Button';

export default function WitchitaDeceptia2() {
  const [showScreen, setShowScreen] = useState(false);
  const [showCurtainUp, setShowCurtainUp] = useState(false);
  const { snapshot }: SnapshotContextValue = useSnapshot();

  const FADE_MS = 1500;
  const HOLD_MS = 200;

  const onCurtainDownEnded= () => {
    setShowScreen(true);
  };

  const handleDialogueComplete = () => {
    setShowCurtainUp(true);
  };

  const onCurtainUpEnded = () => {
    handleAdvancePhase();
  }

  return (
    <div className={styles.container}>
      <CurtainDown fadeMs={FADE_MS} onEffectEnded={onCurtainDownEnded} ></CurtainDown>

      {showScreen && (
        <div className={styles.screenContainer}>
          <Label className={`${styles.label} ${styles.title}`}>
            Defeat Witchita Deceptia!
          </Label>
          <img className={`${styles.character}`} alt='Witchita Deceptia' src='characters\witchita_deceptia\WitchitaDeceptia.png' />

          <Label className={`${styles.label} ${styles.rosterText}`}>
            Fighting Witchita Deceptia:
          </Label>
          <Roster
            className={`${styles.roster}`}
            players={getPlayersFromVoteKeys(snapshot)}
            altText='Noone picked yet!'
          />
          {getPlayersFromVoteKeys(snapshot).length >= 0 && 
            <Button
              label={'Fight!'}
              className={`${styles.button}`}
            />
          }
          {/* TODO move button and set > 0 */}

        </div>
      )}

      {showCurtainUp && (
        <CurtainUp fadeMs={FADE_MS} holdMs={HOLD_MS} onEffectEnded={onCurtainUpEnded} />
      )}
    </div>
  );
}