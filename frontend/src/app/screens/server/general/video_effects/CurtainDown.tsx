"use client";

import React, { useEffect, useRef, useState } from 'react';
import styles from './CurtainDown.module.css';

interface CurtainDownProps {
  fadeMs?: number;
  holdMs?: number;
  onEffectEnded?: () => void;
}

const CurtainDown: React.FC<CurtainDownProps> = ({ fadeMs = 1500, holdMs = 0, onEffectEnded }) => {
  const [overlayActive, setOverlayActive] = useState(false);
  const [curtainsIn, setCurtainsIn] = useState(false);

  const onEffectEndedRef = useRef(onEffectEnded);
  onEffectEndedRef.current = onEffectEnded;

  const fadeRef = useRef(fadeMs);
  const holdRef = useRef(holdMs);

  useEffect(() => {
    const t1 = setTimeout(() => setCurtainsIn(true), 1);
    const t2 = setTimeout(() => setOverlayActive(true), 1);

    const totalMs = (holdRef.current ?? 0) + (fadeRef.current ?? 0);

    const t3 = setTimeout(() => {
      try {
        onEffectEndedRef.current?.();
      } catch (err) {
      }
    }, totalMs);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={`${styles.topCurtain} ${curtainsIn ? styles.moved : ''}`}
        style={{ transitionDuration: `${fadeMs}ms` }}
      />
      <div className={`${styles.bottomCurtain} ${curtainsIn ? styles.moved : ''}`}
        style={{ transitionDuration: `${fadeMs}ms` }}
      />

      <div
        className={`${styles.overlay} ${overlayActive ? styles.moved : ''}`}
        style={{ transitionDuration: `${fadeMs}ms` }}
      />
    </div>
  );
};

export default CurtainDown;
