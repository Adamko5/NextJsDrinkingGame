"use client";

import React, { useEffect, useRef, useState } from 'react';
import styles from './VideoPlayer.module.css';

export type VideoPlayerStage = 'playing' | 'fadeToBlack' | 'blackHold' | 'fadeFromBlack' | 'showDialogue';

interface VideoPlayerProps {
  src: string;
  onVideoEnded?: () => void;
  onSequenceComplete?: () => void;
  autoPlay?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  fadeMs?: number;
  holdMs?: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, onVideoEnded, autoPlay = true, muted = true, playsInline = true, fadeMs = 1500, holdMs = 200 }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stage, setStage] = useState<VideoPlayerStage>('playing');
  const [blackOpacity, setBlackOpacity] = useState<number>(0);

  useEffect(() => {
    if (stage === 'fadeToBlack') {
      requestAnimationFrame(() => setBlackOpacity(1));
      const t = setTimeout(() => setStage('blackHold'), fadeMs);
      return () => clearTimeout(t);
    }

    if (stage === 'blackHold') {
      const t = setTimeout(() => setStage('fadeFromBlack'), holdMs);
      return () => clearTimeout(t);
    }

    if (stage === 'fadeFromBlack') {
      requestAnimationFrame(() => setBlackOpacity(0));
      const t = setTimeout(() => setStage('showDialogue'), fadeMs);
      return () => clearTimeout(t);
    }
  }, [stage, fadeMs, holdMs]);

  const onEnded = () => {
    setStage('fadeToBlack');
    onVideoEnded?.();
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
          src={src}
          autoPlay={autoPlay}
          muted={muted}
          playsInline={playsInline}
          onEnded={onEnded}
          className={styles.video}
        />
      )}

      <div
        aria-hidden
        className={overlayClassName}
        style={{ opacity: blackOpacity }}
      />

      <div aria-hidden className={bottomBarClass} />

      {/* The component exposes stages via state, parent can coordinate by listening to onVideoEnded or internal stage if required */}
    </div>
  );
};

export default VideoPlayer;
