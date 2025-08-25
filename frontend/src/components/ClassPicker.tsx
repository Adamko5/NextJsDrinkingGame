"use client";

import React from 'react';
import { classes, GameClass } from '../lib/classes';
import styles from './ClassPicker.module.css';

interface Props {
  selectedId: string;
  onChange: (newId: string) => void;
}

/**
 * Renders a simple carousel allowing the user to pick one of the available
 * character classes. The current selection is passed in via `selectedId` and
 * changes are propagated through the `onChange` callback. This component is
 * purely client-side and keeps no internal state.
 *
 * The carousel displays the class image, name and description. Left/right
 * buttons cycle through the predefined classes and wrap around at the ends.
 */
export default function ClassPicker({ selectedId, onChange }: Props) {
  const index = classes.findIndex((c) => c.id === selectedId);
  const current: GameClass = classes[index] || classes[0];

  const handlePrev = () => {
    const newIndex = (index - 1 + classes.length) % classes.length;
    onChange(classes[newIndex].id);
  };
  const handleNext = () => {
    const newIndex = (index + 1) % classes.length;
    onChange(classes[newIndex].id);
  };

  return (
    <div className={styles.picker}>
      <button
        type="button"
        className={`${styles.arrow} ${styles.arrowLeft}`}
        aria-label="Previous class"
        onClick={handlePrev}
      >
        ‹
      </button>
      <div className={styles.card}>
        <div
          className={styles.image}
          style={{ backgroundImage: `url(${current.imageSrc})` }}
        />
        <div className={styles.info}>
          <div className={styles.name}>{current.name}</div>
          <div className={styles.description}>{current.description}</div>
        </div>
      </div>
      <button
        type="button"
        className={`${styles.arrow} ${styles.arrowRight}`}
        aria-label="Next class"
        onClick={handleNext}
      >
        ›
      </button>
    </div>
  );
}