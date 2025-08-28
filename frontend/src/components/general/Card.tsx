import React from 'react';
import styles from './Card.module.css';

export interface CardProps {
  /** The content to render inside the card. */
  children: React.ReactNode;
  /**
   * Optional class name to allow further customisation from the
   * outside.  For example margins or custom widths.
   */
  className?: string;
  /**
   * Elevation level controlling the drop shadow.  Higher values
   * result in a more pronounced shadow.
   */
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  /**
   * Optional click handler.  When provided the card will respond
   * to pointer events.
   */
  onClick?: () => void;
}

/**
 * A simple container component used to group related content.  The
 * card has a subtle border, rounded corners and a configurable
 * elevation (shadow).  It uses theme variables for its colours.
 */
const Card: React.FC<CardProps> = ({ children, className, elevation = 'sm', onClick }) => {
  const elevationClass = (styles as Record<string, string>)[elevation] || styles.sm;
  return (
    <div className={`${styles.card} ${elevationClass} ${className ?? ''}`.trim()} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;