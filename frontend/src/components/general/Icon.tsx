import React from 'react';
import styles from './Icon.module.css';

export interface IconProps {
  /**
   * Children should be an SVG or other element representing the icon.  It
   * will be wrapped in a span so that sizing and colour can be
   * controlled uniformly.
   */
  children: React.ReactNode;
  /**
   * A numeric or string value to control the size of the icon.  The
   * default of 1em means the icon will follow the surrounding font
   * size.  You can specify pixels (e.g. 24) or CSS units (e.g. '2rem').
   */
  size?: number | string;
  /**
   * Colour of the icon.  Defaults to the current text colour.
   */
  color?: string;
  /**
   * Additional class name(s) to apply to the wrapper span.
   */
  className?: string;
}

/**
 * A wrapper component for icons.  It standardises sizing,
 * alignment and colour handling.  You can pass any SVG or
 * custom icon component as `children`.
 */
const Icon: React.FC<IconProps> = ({ children, size = '1em', color = 'currentColor', className }) => {
  const style: React.CSSProperties = { fontSize: size, color };
  return (
    <span className={`${styles.icon} ${className ?? ''}`.trim()} style={style}>
      {children}
    </span>
  );
};

export default Icon;