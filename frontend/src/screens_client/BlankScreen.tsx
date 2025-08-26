"use client";

import React from 'react';
import styles from './BlankScreen.module.css';

export default function BlankScreen() {
  return (
    <div className={styles.container}>
      <div className={styles.message}>No actions to be done.</div>
    </div>
  );
}
