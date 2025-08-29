"use client";

import React from 'react';
import styles from './HostLobby.module.css';

/**
 * Props for the HostLobby component.  The join URL is the full URL
 * that players should open on their devices to join the lobby.
 */
export interface HostLobbyProps {
  joinUrl: string;
}

/**
 * Displays a QR code along with the join URL for players to scan or
 * copy.  Uses an external API to generate the QR code on the fly.
 */
const HostLobby: React.FC<HostLobbyProps> = ({ joinUrl }) => {
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
    joinUrl
  )}&size=200x200`;
  return (
    <div className={styles.container}>
      <div className={styles.label}>Scan or visit this URL to join:</div>
      <div className={styles.qr}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qrSrc} alt="Join QR code" width={128} height={128} />
      </div>
      <div className={styles.url}>{joinUrl}</div>
    </div>
  );
};

export default HostLobby;