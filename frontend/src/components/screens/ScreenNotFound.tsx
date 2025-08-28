"use client";

import React from 'react';
import styles from './ScreenNotFound.module.css';

export default function ScreenNotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.message}>Screen not found.</div>
    </div>
  );
}
