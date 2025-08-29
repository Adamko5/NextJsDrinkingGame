"use client";

import React from 'react';
import styles from './ClassPicker.module.css';
import { GameClasses } from '../../../../../constants/classes';
import { GameClass } from '../../../../../client/models';
import Label from '@/components/general/Label';

export interface ClassPickerProps {
  value: string | null;
  onChange: (newValue: string) => void;
  /**
   * The available class options.  Defaults to a small set of
   * archetypal fantasy classes if not provided.
   */
  options?: GameClass[];
}

/**
 * A grid of selectable cards allowing the player to choose their
 * character class/trait.  Selected cards are highlighted.  On
 * desktop the grid automatically expands to fill available width.
 */
const ClassPicker: React.FC<ClassPickerProps> = ({
  value,
  onChange,
  options = GameClasses,
}) => {
  return (
    <div className={styles.grid}>
      {options.map((opt: GameClass) => {
        const selected = value === opt.name;
        return (
          <div
            key={opt.name}
            className={`${styles.card} ${selected ? styles.selected : ''}`}
            onClick={() => onChange(opt.name)}
            style={{ cursor: 'pointer' }}
          >
            <img className={styles.image} src={opt.imageSrc} alt={opt.name} />
            <Label className={styles.label}>{opt.name}</Label>
            <Label className={styles.label}>{opt.description}</Label>
          </div>
        );
      })}
    </div>
  );
};

export default ClassPicker;