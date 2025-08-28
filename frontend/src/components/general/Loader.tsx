import React from 'react';
import styles from './Loader.module.css';

export interface LoaderProps {
  /**
   * The diameter of the spinner in pixels.  Defaults to 40.
   */
  size?: number;
  /**
   * Colour of the spinner’s active segment.  Accepts any valid CSS
   * colour string.  By default this uses the primary theme colour.
   */
  color?: string;
  /**
   * Optional class name for extra styling.
   */
  className?: string;
}

/**
 * A circular loader/spinner indicating that something is happening
 * asynchronously.  The spinner is rendered using borders and a
 * rotation animation.  Adjust the `size` prop to make it bigger
 * or smaller.
 */
const Loader: React.FC<LoaderProps> = ({ size = 40, color = 'var(--primary)', className }) => {
  return (
    <div
      className={`${styles.loader} ${className ?? ''}`.trim()}
      style={{ width: size, height: size, borderColor: 'var(--border)', borderTopColor: color }}
    />
  );
};

export default Loader;