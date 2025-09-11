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
const FADE_MS = 300; // fade in/out duration in ms

const Dialogue1: React.FC<Dialogue1Props> = ({ dialogue, onDialogueComplete }) => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const timerRef = useRef<number | null>(null);
  const fadeTimerRef = useRef<number | null>(null);
  const completedRef = useRef(false);
  const [showContinueButton, setShowContinueButton] = useState(false);

  const lines = dialogue.dialogueLines || [];

  // build effective line (dialogue-level defaults are expected to be spread into each line in the data)
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

  useEffect(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (fadeTimerRef.current) {
      window.clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }

    // showing a regular line
    if (index < lines.length) {
      const current = buildEffective(lines[index]);
      setShowContinueButton(false);
      const isLastAndKept = dialogue.keepLastDisplayed && index === lines.length - 1;
      // prepare text animation (if enabled)
      const duration = current.durationMs ?? DEFAULT_DURATION;
      if (current.animateInText) {
        // fade in immediately
        setTextVisible(true);
        // schedule fade out slightly before advancing
        if (!isLastAndKept) {
          const fadeStart = Math.max(0, duration - FADE_MS);
          fadeTimerRef.current = window.setTimeout(() => setTextVisible(false), fadeStart);
        }
      } else {
        setTextVisible(true);
      }

      // show image/text container immediately
      setVisible(true);

      timerRef.current = window.setTimeout(() => setIndex(i => i + 1), duration);

      return () => {
        if (timerRef.current) {
          window.clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        if (fadeTimerRef.current) {
          window.clearTimeout(fadeTimerRef.current);
          fadeTimerRef.current = null;
        }
      };
    }

    // finished lines
    if (index === lines.length) {
      if (dialogue.keepLastDisplayed && lines.length > 0) {
        // immediately show final image and continue button
        setVisible(true);
        setTextVisible(true);
        setShowContinueButton(true);

        return () => {
          if (timerRef.current) {
            window.clearTimeout(timerRef.current);
            timerRef.current = null;
          }
          if (fadeTimerRef.current) {
            window.clearTimeout(fadeTimerRef.current);
            fadeTimerRef.current = null;
          }
        };
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
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (fadeTimerRef.current) {
      window.clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
    setIndex(i => i + 1);
  };

  // determine effectiveLine to render (either current line or last line for keepLastDisplayed)
  let effectiveLine: (DialogueLine & { durationMs?: number }) | undefined;
  let isFinalImageStage = false;

  if (index < lines.length) {
    effectiveLine = buildEffective(lines[index]);
  } else if (dialogue.keepLastDisplayed && lines.length > 0 && index === lines.length) {
    effectiveLine = buildEffective(lines[lines.length - 1]);
    isFinalImageStage = true;
  }

  // if nothing to render, return null
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
    // allow overriding other text styles in future
  };

  return (
    <div className={styles.container}>
      {imgSrc && (
        <img
          key={isFinalImageStage ? `final-${index}` : `char-${index}`}
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
            // animate opacity for text fade in/out; if animateInText is disabled, keep fully visible
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