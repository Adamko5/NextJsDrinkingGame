"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './Dialogue1.module.css';
import { Dialogue, DialogueLine } from '@/constants/dialogue';
import Button from '../../../../../components/general/Button';
import Label from '@/components/general/Label';

interface Dialogue1Props {
    dialogue: Dialogue;
    onDialogueComplete?: () => void;
}

const DEFAULT_DURATION = 3000;
const FADE_MS = 300;

const Dialogue1: React.FC<Dialogue1Props> = ({ dialogue, onDialogueComplete }) => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const timerRef = useRef<number | null>(null);
  const fadeTimerRef = useRef<number | null>(null);
  const completedRef = useRef(false);
  const [showContinueButton, setShowContinueButton] = useState(false);

  const lines = dialogue.dialogueLines || [];

  const buildEffective = (line?: DialogueLine) => {
    const defaults = {
      characterImage: undefined,
      imageSize: undefined,
      durationMs: DEFAULT_DURATION,
      position: { x: 50, y: 50 },
      textPosition: { x: 0, y: -10 },
      textColor: '#fff',
      textBackgroundColor: 'rgba(0,0,0,0.6)',
      animateInImage: false,
      animateInText: false,
      textSize: undefined,
    } as const;

    return { ...defaults, ...(line || {}) } as DialogueLine & typeof defaults;
  };

  const clearTimerRef = (ref: React.RefObject<number | null>) => {
    if (ref.current) {
      window.clearTimeout(ref.current);
      ref.current = null;
    }
  };

  const clearAllTimers = () => {
    clearTimerRef(timerRef);
    clearTimerRef(fadeTimerRef);
  };

  const scheduleFadeOut = (delayMs: number) => {
    clearTimerRef(fadeTimerRef);
    fadeTimerRef.current = window.setTimeout(() => setTextVisible(false), delayMs);
  };

  const scheduleAdvance = (durationMs: number) => {
    clearTimerRef(timerRef);
    timerRef.current = window.setTimeout(() => setIndex(i => i + 1), durationMs);
  };

  useEffect(() => {
    clearAllTimers();

    if (index < lines.length) {
      const current = buildEffective(lines[index]);
      setShowContinueButton(false);

      const isLastAndKept = dialogue.keepLastDisplayed && index === lines.length - 1;
      const duration = current.durationMs ?? DEFAULT_DURATION;

      if (current.animateInText) {
        setTextVisible(true);
        if (!isLastAndKept) {
          const fadeStart = Math.max(0, duration - FADE_MS);
          scheduleFadeOut(fadeStart);
        }
      } else {
        setTextVisible(true);
      }

      setVisible(true);
      scheduleAdvance(duration);

      return () => clearAllTimers();
    }

    if (index === lines.length) {
      if (dialogue.keepLastDisplayed && lines.length > 0) {
        setVisible(true);
        setTextVisible(true);
        setShowContinueButton(true);

        return () => clearAllTimers();
      }

      if (!completedRef.current) {
        completedRef.current = true;
        onDialogueComplete?.();
      }
    }

    return;
  }, [index, dialogue.keepLastDisplayed]);

  const handleContinue = () => {
    if (!completedRef.current) {
      completedRef.current = true;
      setShowContinueButton(false);
      onDialogueComplete?.();
    }

    clearAllTimers();
    setIndex(i => i + 1);
  };

  let effectiveLine: (DialogueLine & { durationMs?: number }) | undefined;
  let isFinalImageStage = false;

  if (index < lines.length) {
    effectiveLine = buildEffective(lines[index]);
  } else if (dialogue.keepLastDisplayed && lines.length > 0 && index === lines.length) {
    effectiveLine = buildEffective(lines[lines.length - 1]);
    isFinalImageStage = true;
  }

  if (!effectiveLine && index > lines.length) return null;

  const imgSrc = effectiveLine?.characterImage ? `/${effectiveLine.characterImage}` : undefined;
  const charPos = effectiveLine?.position ?? { x: 50, y: 50 };
  const textPos = effectiveLine?.textPosition ?? { x: 0, y: -10 };

  const imgLeft = `${charPos.x}%`;
  const imgTop = `${charPos.y}%`;
  const bubbleLeft = `calc(${charPos.x}% + ${textPos.x}%)`;
  const bubbleTop = `calc(${charPos.y}% + ${textPos.y}%)`;

  const imgSize = effectiveLine?.imageSize as { width: number; height: number } | undefined;
  const imgStyle: React.CSSProperties = {
    left: imgLeft,
    top: imgTop,
    ...(imgSize ? { width: `${imgSize.width}%`, height: `${imgSize.height}%` } : {}),
  };

  const lineClass = [styles.line];

  const charClass = [styles.character];

  const showBubble = !!effectiveLine?.text;

  const labelStyle: React.CSSProperties = {
    color: effectiveLine?.textColor ?? '#fff',
    fontSize: effectiveLine?.textSize ? `${effectiveLine.textSize}px` : undefined,
  };

  return (
    <div className={styles.container}>
      {imgSrc && (
        <img
          // stable key based on image path so the element isn't remounted when index changes
          key={effectiveLine?.characterImage ? `${isFinalImageStage ? 'final-' : 'char-'}${effectiveLine.characterImage}` : `char-${index}`}
           src={imgSrc}
           alt="character"
           className={charClass.join(' ')}
           style={imgStyle}
           draggable={false}
         />
       )}

      {showBubble && (
        <div
          className={lineClass.join(' ')}
          style={{
            left: bubbleLeft,
            top: bubbleTop,
            background: effectiveLine?.textBackgroundColor ?? 'rgba(0,0,0,0.6)',
            opacity: effectiveLine?.animateInText ? (textVisible ? 1 : 0) : 1,
            transition: effectiveLine?.animateInText ? `opacity ${FADE_MS}ms ease` : undefined,
          }}
        >
          <Label className={styles.text} style={labelStyle}>
            {effectiveLine?.text}
          </Label>
        </div>
      )}

      {showContinueButton && (
        <div className={styles.buttonWrap}>
          <Button label="Continue" onClick={handleContinue} />
        </div>
      )}
    </div>
  );
};

export default Dialogue1;