"use client";

import React from 'react';
import Card from '@/components/general/Card';
import styles from './client.module.css';

export interface ClientContainerProps {
  /**
   * The screen component to render inside this container.  It
   * should already be a client component when used from the
   * router.
   */
  ScreenComponent: React.ComponentType<any>;
}

/**
 * Wraps a game screen for the client role with a patterned
 * background and a bordered card.  This ensures a consistent
 * presentation across all client screens.  The Card component
 * provides a subtle elevation and border using theme colours.
 */
const ClientContainer: React.FC<ClientContainerProps> = ({ ScreenComponent }) => {
  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <ScreenComponent />
      </Card>
    </div>
  );
};

export default ClientContainer;