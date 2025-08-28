import React, { useEffect } from 'react';
import styles from './Toast.module.css';

export interface ToastProps {
  /** Message text displayed within the toast. */
  message: string;
  /**
   * Visual variant of the toast.  Defaults to `info` but can be
   * overridden to emphasise successes, warnings or errors.
   */
  type?: 'info' | 'success' | 'warning' | 'error';
  /**
   * How long (in ms) the toast remains visible before calling
   * onClose.  Passing 0 will disable auto‑dismiss.
   */
  duration?: number;
  /**
   * Callback invoked when the toast should be dismissed.  It’s the
   * caller’s responsibility to remove the toast from the DOM.
   */
  onClose?: () => void;
}

/**
 * A small notification component that appears in the corner of the
 * screen.  It automatically dismisses itself after the specified
 * duration, calling the provided `onClose` callback.  Variants
 * control the coloured accent bar on the left.
 */
const Toast: React.FC<ToastProps> = ({ message, type = 'info', duration = 3000, onClose }) => {
  useEffect(() => {
    if (!duration || duration <= 0) return;
    const timer = window.setTimeout(() => {
      onClose && onClose();
    }, duration);
    return () => window.clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`${styles.toast} ${styles[type]}`.trim()}>
      <span>{message}</span>
    </div>
  );
};

export default Toast;