import React from 'react';
import styles from './Input.module.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Additional class name to merge with the internal styles.  Useful
   * for margin adjustments or custom width.
   */
  className?: string;
}

/**
 * A basic text input component styled to match the application
 * theme.  This component accepts all standard input props such as
 * `value`, `onChange`, `placeholder`, etc.  Focus states include
 * a coloured border and subtle box shadow.
 */
const Input: React.FC<InputProps> = ({ className, ...rest }) => {
  return <input className={`${styles.input} ${className ?? ''}`.trim()} {...rest} />;
};

export default Input;