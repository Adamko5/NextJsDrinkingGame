"use client";

import React from 'react';
import styles from './server.module.css';

export interface ServerContainerProps {
  /** The screen component to render inside this container. */
  ScreenComponent: React.ComponentType<any>;
  backgroundImage?: string;
  backgroundVideo?: string;
  /** Inline styles to apply to the container. */
  style?: React.CSSProperties;
}

/**
 * Wraps a game screen for the server role with a patterned background and a bordered card.
 * Background priority: video > image > default pattern.
 */
const ServerContainer: React.FC<ServerContainerProps> = ({
  ScreenComponent,
  backgroundImage,
  backgroundVideo,
  style,
}) => {
  // Default patterned background previously defined in CSS moved here.
  const defaultBackground = {
    backgroundColor: 'var(--neutral-50)',
    backgroundImage:
      'repeating-linear-gradient(45deg, var(--blue-50), var(--blue-50) 10px, transparent 10px, transparent 20px)',
    backgroundSize: 'cover',
  };

  // Start with the provided style and ensure position is relative.
  let containerStyle: React.CSSProperties = { ...style, position: 'relative' };

  if (backgroundVideo) {
    // Use video background; no additional inline background needed.
  } else if (backgroundImage) {
    // Use the provided image with correct fit.
    containerStyle = {
      ...containerStyle,
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  } else {
    // Use default patterned background.
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

export default ServerContainer;