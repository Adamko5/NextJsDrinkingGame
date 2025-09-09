"use client";

import React, { useState, useEffect } from 'react';
import styles from './ColorPicker.module.css';
import { PlayerColors, PlayerColor } from '@/constants/player-colors';
import Label from '@/components/general/Label';

export interface ColorPickerProps {
  /**
   * The currently selected colour name. May be null when no colour has
   * been chosen yet.
   */
  value: string | null;
  /**
   * Called whenever the user picks a new colour. The callback receives
   * the name of the selected colour.
   */
  onChange: (newValue: string) => void;
  /**
   * Optional list of available colours. Defaults to the built‑in
   * PlayerColors constant.
   */
  options?: PlayerColor[];
}

/**
 * A picker that displays one colour at a time with navigation arrows.
 * Clicking the left or right arrow cycles through the available colours.
 * Clicking the card itself selects the currently visible colour.  The
 * selected card is highlighted using the styles defined in
 * `ColorPicker.module.css`.
 */
const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  options = PlayerColors,
}) => {
  // Keep track of which colour is currently in view.  Initialise the
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
        {/* Using Unicode left‑pointing triangle */}
        ◀
      </button>
      <div
        className={`${styles.card} ${value === current.name ? styles.selected : ''}`}
        onClick={handleSelect}
        style={{ cursor: 'pointer', borderColor: `#${current.code}` }}
      >
        <div
          className={styles.swatch}
          style={{ backgroundColor: `#${current.code}` }}
        />
        <Label
          className={styles.label}
          style={{ color: `#${current.code}`, fontWeight: 'bold' }}
        >
          {current.name}
        </Label>
      </div>
      <button
        type="button"
        className={styles.arrow}
        onClick={handleNext}
        disabled={options.length <= 1}
        style={{ cursor: 'pointer' }}
      >
        {/* Using Unicode right‑pointing triangle */}
        ▶
      </button>
    </div>
  );
};

export default ColorPicker;