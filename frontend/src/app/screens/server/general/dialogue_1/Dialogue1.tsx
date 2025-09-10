"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './Dialogue1.module.css';
import { Dialogue, DialogueLine } from '@/constants/dialogue';
import Button from '../../../../../components/general/Button';
import { handleAdvancePhase } from '@/util/util';
import Label from '@/components/general/Label';

interface Dialogue1Props {
    dialogue: Dialogue;
    onDialogueComplete?: () => void;
}

const DEFAULT_DURATION = 3000;

const Dialogue1: React.FC<Dialogue1Props> = ({ dialogue, onDialogueComplete }) => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<number | null>(null);
  const completedRef = useRef(false);
  const [showContinueButton, setShowContinueButton] = useState(false);

  const lines = dialogue.dialogueLines || [];

  // helper to build effective line with defaults from dialogue
  const buildEffective = (line?: DialogueLine) => {
    const defaults = {
      characterImage: dialogue.characterImage,
      imageSize: dialogue.imageSize,
      durationMs: dialogue.durationMs,
      position: dialogue.position,
      textPosition: dialogue.textPosition,
      textColor: dialogue.textColor,
      textBackgroundColor: dialogue.textBackgroundColor,
      animateIn: dialogue.animateIn,
    } as any;

    return { ...defaults, ...(line || {}) } as Required<Partial<DialogueLine & typeof defaults>>;
  };

  useEffect(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (index < lines.length) {
      const current = buildEffective(lines[index]);

      setVisible(false);
      const raf = requestAnimationFrame(() => setVisible(true));

      const duration = current.durationMs ?? DEFAULT_DURATION;
      timerRef.current = window.setTimeout(() => {
        setIndex((i) => i + 1);
      }, duration);

      return () => {
        cancelAnimationFrame(raf);
        if (timerRef.current) {
          window.clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      };
    }

    if (index === lines.length) {
      if (!dialogue.characterImage) {
        if (!completedRef.current) {
          completedRef.current = true;
          onDialogueComplete?.();
        }
        return;
      }

      setVisible(false);
      const raf = requestAnimationFrame(() => setVisible(true));
      setShowContinueButton(true);

      return () => {
        cancelAnimationFrame(raf);
        if (timerRef.current) {
          window.clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      };
    }

    return;
  }, [index]);

  const handleContinue = () => {
    if (!completedRef.current) {
      completedRef.current = true;
      setShowContinueButton(false);
      onDialogueComplete?.();
    }
    setIndex((i) => i + 1);
  };

  if (index > lines.length) return null;

  if (index < lines.length) {
    const current = buildEffective(lines[index]);

    const charPos = current.position ?? { x: 50, y: 50 };
    const textPos = current.textPosition ?? { x: 0, y: -10 };

    const imgLeft = `${charPos.x}%`;
    const imgTop = `${charPos.y}%`;

    const bubbleLeft = `calc(${charPos.x}% + ${textPos.x}%)`;
    const bubbleTop = `calc(${charPos.y}% + ${textPos.y}%)`;

    const imgSrc = current.characterImage ? `/${current.characterImage}` : undefined;

    const imgSize = current.imageSize;
    const imgStyle: React.CSSProperties = {
      left: imgLeft,
      top: imgTop,
      ...(imgSize ? { width: `${imgSize.width}%`, height: `${imgSize.height}%` } : {}),
    };

    const lineClass = [styles.line];
    if (current.animateIn) lineClass.push(styles.animateIn);
    if (visible) lineClass.push(styles.visible);

    // TODO increase styles.text size, change color
    // TODO animate in the imaget too
    // Make the animation better

    return (
      <div className={styles.container}>
        {imgSrc && (
          <img
            src={imgSrc}
            alt="character"
            className={styles.character}
            style={imgStyle}
            draggable={false}
          />
        )}

        <div
          className={lineClass.join(' ')}
          style={{ left: bubbleLeft, top: bubbleTop, color: current.textColor ?? '#fff', background: current.textBackgroundColor ?? 'rgba(0,0,0,0.6)' }}
        >
          <Label className={styles.text}>{current.text}</Label>
        </div>
      </div>
    );
  }

  const finalImgSrc = dialogue.characterImage ? `/${dialogue.characterImage}` : undefined;
  const finalPos = dialogue.position ?? { x: 50, y: 50 };
  const finalSize = dialogue.imageSize;

  const finalStyle: React.CSSProperties = {
    left: `${finalPos.x}%`,
    top: `${finalPos.y}%`,
    ...(finalSize ? { width: `${finalSize.width}%`, height: `${finalSize.height}%` } : {}),
  };

  return (
    <div className={styles.container}>
      {finalImgSrc && (
        <img
          src={finalImgSrc}
          alt="character"
          className={styles.character}
          style={finalStyle}
          draggable={false}
        />
      )}

      {showContinueButton && (
        <div className={styles.buttonWrap}>
          <Button label="Continue" onClick={handleAdvancePhase} />
        </div>
      )}
    </div>
  );
};

export default Dialogue1;