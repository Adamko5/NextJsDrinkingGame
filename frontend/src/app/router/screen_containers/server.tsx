"use client";

import React from 'react';
import Card from '@/components/general/Card';
import styles from './server.module.css';

export interface ServerContainerProps {
  /** The screen component to render inside this container. */
  ScreenComponent: React.ComponentType<any>;
}

/**
 * Wraps a game screen for the server role with a patterned
 * background and a bordered card.  This ensures a consistent
 * presentation across all server screens.  The appearance can
 * differ from the client container to provide subtle visual
 * separation between roles, but currently shares the same
 * structure.
 */
const ServerContainer: React.FC<ServerContainerProps> = ({ ScreenComponent }) => {
  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <ScreenComponent />
      </Card>
    </div>
  );
};

export default ServerContainer;