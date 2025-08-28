import React from 'react';
import styles from './ToggleSwitch.module.css';

export interface ToggleSwitchProps {
  /** Whether the switch is currently on. */
  checked: boolean;
  /** Called when the switch is toggled.  The new value is passed to
   *  the callback. */
  onChange: (checked: boolean) => void;
  /** Disable interaction with the switch. */
  disabled?: boolean;
  /** Optional additional class name. */
  className?: string;
  /** Optional label displayed next to the switch. */
  label?: string;
}

/**
 * A stylised toggle switch component representing a binary state.
 * Uses a hidden checkbox under the hood.  When disabled, user
 * interactions are prevented and the appearance is dimmed.
 */
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, disabled = false, className, label }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    onChange(e.target.checked);
  };
  return (
    <label className={`${styles.switchWrapper} ${className ?? ''}`.trim()}>
      <span className={styles.switch} data-disabled={disabled || undefined}>
        <input
          type="checkbox"
          className={styles.input}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
        />
        <span className={styles.slider} />
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
};

export default ToggleSwitch;