"use client";

import React from 'react';
import styles from './ClassPicker.module.css';

/**
 * Represents a single class or trait option that players can choose
 * before joining the game.  Each option has an identifier, a
 * human‑friendly name and an emoji used as a simple icon.  The
 * number and names of the options can be easily extended or
 * customised without modifying the component logic.
 */
export interface ClassOption {
  id: string;
  name: string;
  icon: string;
}

/**
 * Props for the ClassPicker.  The current selected value and the
 * callback for when a new value is chosen are required.  Passing
 * `null` as the value indicates that no option is selected.
 */
export interface ClassPickerProps {
  value: string | null;
  onChange: (newValue: string) => void;
  /**
   * The available class options.  Defaults to a small set of
   * archetypal fantasy classes if not provided.
   */
  options?: ClassOption[];
}

const defaultOptions: ClassOption[] = [
  { id: 'warrior', name: 'Warrior', icon: '🛡️' },
  { id: 'mage', name: 'Mage', icon: '🧙' },
  { id: 'rogue', name: 'Rogue', icon: '🗡️' },
  { id: 'healer', name: 'Healer', icon: '💊' },
];

/**
 * A grid of selectable cards allowing the player to choose their
 * character class/trait.  Selected cards are highlighted.  On
 * desktop the grid automatically expands to fill available width.
 */
const ClassPicker: React.FC<ClassPickerProps> = ({ value, onChange, options = defaultOptions }) => {
  return (
    <div className={styles.grid}>
      {options.map((opt) => {
        const selected = value === opt.id;
        return (
          <div
            key={opt.id}
            className={`${styles.card} ${selected ? styles.selected : ''}`}
            onClick={() => onChange(opt.id)}
          >
            <div className={styles.icon}>{opt.icon}</div>
            <div className={styles.label}>{opt.name}</div>
          </div>
        );
      })}
    </div>
  );
};

export default ClassPicker;