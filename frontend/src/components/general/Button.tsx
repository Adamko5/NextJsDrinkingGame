import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The text shown inside the button.  This should be short and actionable.
   */
  label: string;
  /**
   * Visual style of the button.  Primary buttons carry the most weight
   * (for form submissions, key actions), while secondary, outline and
   * text buttons are progressively lighter.
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
}

/**
 * A themed button component.  It supports a handful of variants and
 * automatically applies sensible defaults like padding, border radius
 * and hover states.  Disabled buttons will lower opacity and remove
 * pointer events.
 */
const Button: React.FC<ButtonProps> = ({ label, variant = 'primary', className, disabled, ...rest }) => {
  const variantClass = (styles as Record<string, string>)[variant] || styles.primary;
  return (
    <button
      className={`${styles.button} ${variantClass} ${disabled ? styles.disabled : ''} ${className ?? ''}`.trim()}
      disabled={disabled}
      {...rest}
    >
      {label}
    </button>
  );
};

export default Button;