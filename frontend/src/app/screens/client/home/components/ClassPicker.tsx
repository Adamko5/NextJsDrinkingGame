"use client";

import React, { useState, useEffect } from 'react';
import styles from './ClassPicker.module.css';
import { GameClasses } from '../../../../../constants/classes';
import { GameClass } from '../../../../../client/models';
import Label from '@/components/general/Label';

export interface ClassPickerProps {
  /**
   * The currently selected class name.  May be null when no class has
   * been chosen yet.
   */
  value: string | null;
  /**
   * Called whenever the user picks a new class.  The callback receives
   * the name of the selected class.
   */
  onChange: (newValue: string) => void;
  /**
   * Optional list of available classes.  Defaults to the built‑in
   * GameClasses constant.
   */
  options?: GameClass[];
}

/**
 * A picker that displays one class at a time with navigation arrows.
 * Clicking the left or right arrow cycles through the available classes.
 * Clicking the card itself selects the currently visible class.  The
 * selected card is highlighted using the styles defined in
 * `ClassPicker.module.css`.
 */
const ClassPicker: React.FC<ClassPickerProps> = ({
  value,
  onChange,
  options = GameClasses,
}) => {
  // Keep track of which class is currently in view.  Initialise the
  // index based on the incoming value if provided.
  const [index, setIndex] = useState(() => {
    if (value) {
      const initial = options.findIndex((opt) => opt.name === value);
      return initial >= 0 ? initial : 0;
    }
    return 0;
  });

  // When the value prop changes externally, update the index to match.
  useEffect(() => {
    if (value) {
      const idx = options.findIndex((opt) => opt.name === value);
      if (idx >= 0 && idx !== index) {
        setIndex(idx);
      }
    }
  }, [value, options]);

  const current = options[index] ?? options[0];

  const handlePrev = () => {
    if (options.length <= 1) return;
    const newIndex = (index - 1 + options.length) % options.length;
    setIndex(newIndex);
    onChange(options[newIndex].name);
  };

  const handleNext = () => {
    if (options.length <= 1) return;
    const newIndex = (index + 1) % options.length;
    setIndex(newIndex);
    onChange(options[newIndex].name);
  };

  const handleSelect = () => {
    onChange(current.name);
  };

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.arrow}
        onClick={handlePrev}
        disabled={options.length <= 1}
        style={{ cursor: 'pointer' }}
      >
        {/* Using Unicode left-pointing triangle */}
        ◀
      </button>
      <div
        className={`${styles.card} ${value === current.name ? styles.selected : ''}`}
        onClick={handleSelect}
        style={{ cursor: 'pointer' }}
      >
        <img className={styles.image} src={current.imageSrc} alt={current.name} />
        <Label className={styles.labelClass}>{current.name}</Label>
        <Label className={styles.label}>{current.description}</Label>
      </div>
      <button
        type="button"
        className={styles.arrow}
        onClick={handleNext}
        disabled={options.length <= 1}
        style={{ cursor: 'pointer' }}
      >
        {/* Using Unicode right-pointing triangle */}
        ▶
      </button>
    </div>
  );
};

export default ClassPicker;