import React from 'react';
import styles from './Label.module.css';

export interface LabelProps {
  /** Associates the label with an input element via its id. */
  htmlFor?: string;
  /** Text or elements to render inside the label. */
  children: React.ReactNode;
  /** Whether to append a required asterisk. */
  required?: boolean;
  /** Additional class name for custom styling. */
  className?: string;
}

/**
 * A simple label component that adds consistent spacing and
 * typography.  It supports an optional required indicator to
 * accompany form inputs.
 */
const Label: React.FC<LabelProps> = ({ children, required = false, className }) => {
  return (
    <div className={`${styles.div} ${className ?? ''}`.trim()}>
      {children}
      {required && <span className={styles.required}>*</span>}
    </div>
  );
};

export default Label;