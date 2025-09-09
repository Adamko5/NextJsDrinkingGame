"use client";

import React from 'react';
import Card from '@/components/general/Card';
import styles from './client.module.css';

export interface ClientContainerProps {
  /**
   * The screen component to render inside this container.
   * It should already be a client component when used from the router.
   */
  ScreenComponent: React.ComponentType<any>;
  backgroundImage?: string;
  backgroundVideo?: string;
  /** Inline styles to apply to the container. */
  style?: React.CSSProperties;
}

/**
 * Wraps a game screen for the client role with a patterned background and a bordered card.
 * Background priority: video > image > default pattern.
 */
const ClientContainer: React.FC<ClientContainerProps> = ({
  ScreenComponent,
  backgroundImage,
  backgroundVideo,
  style,
}) => {
  // Define the default patterned background previously in CSS, moved inline.
  const defaultBackground = {
    backgroundColor: 'var(--neutral-50)',
    backgroundImage:
      'repeating-linear-gradient(45deg, var(--blue-50), var(--blue-50) 10px, transparent 10px, transparent 20px)',
    backgroundSize: 'cover',
  };

  // Start with the provided inline style and ensure position is relative.
  let containerStyle: React.CSSProperties = { ...style, position: 'relative' };

  if (backgroundVideo) {
    // Video background takes priority—no inline background needed.
  } else if (backgroundImage) {
    containerStyle = {
      ...containerStyle,
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  } else {
    containerStyle = { ...containerStyle, ...defaultBackground };
  }

  return (
    <div className={styles.container} style={containerStyle}>
      {backgroundVideo && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className={styles.videoBackground}
          src={backgroundVideo}
        />
      )}
      <ScreenComponent /> 
    </div>
  );
};

export default ClientContainer;