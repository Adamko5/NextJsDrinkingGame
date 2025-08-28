import React from 'react';
import styles from './ClickableImage.module.css';

export interface ClickableImageProps {
  /**
   * Source URL of the image.  Should be an absolute or relative
   * path to an image asset.
   */
  src: string;
  /**
   * Alternative text for the image.  Important for
   * accessibility.
   */
  alt?: string;
  /**
   * Click handler invoked when the image is clicked.
   */
  onClick?: () => void;
  /**
   * Explicit width of the image.  Accepts any valid CSS size
   * unit (e.g. number interpreted as pixels or string with units).
   */
  width?: number | string;
  /**
   * Explicit height of the image.  If omitted, the image’s natural
   * aspect ratio will be preserved.
   */
  height?: number | string;
  /**
   * Optional additional class name(s) to apply.
   */
  className?: string;
}

/**
 * A clickable image component that wraps an <img> element with
 * consistent styling.  Useful for thumbnails, cards or any
 * interactive images.  It applies a slight scale and shadow on
 * hover to indicate interactivity.
 */
const ClickableImage: React.FC<ClickableImageProps> = ({ src, alt = '', onClick, width, height, className }) => {
  const style: React.CSSProperties = {};
  if (width !== undefined) style.width = width;
  if (height !== undefined) style.height = height;
  return (
    <img
      src={src}
      alt={alt}
      onClick={onClick}
      style={style}
      className={`${styles.image} ${className ?? ''}`.trim()}
    />
  );
};

export default ClickableImage;