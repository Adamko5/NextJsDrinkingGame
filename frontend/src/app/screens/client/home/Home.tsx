"use client";

import React, { useState } from 'react';
import Input from '../../../../components/general/Input';
import Label from '../../../../components/general/Label';
import Button from '../../../../components/general/Button';
import ClassPicker from './components/ClassPicker';
import styles from './Home.module.css';

/**
 * The Home screen presented to players on their phones.  It allows
 * the player to enter their name, optionally select a character
 * class/trait and join the lobby.  The layout centres the join
 * form on the page and uses the general Input and Button
 * components for a consistent look.
 */
export default function ClientHome() {
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  /**
   * Handles submission of the join form.  In a real application
   * this would post to the backend to register the player with
   * the current lobby.  Here we simply log to the console and
   * could navigate to the next phase.
   */
  function handleJoin(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      alert('Please enter your name before joining.');
      return;
    }
    // TODO: integrate with backend: POST /api/players with name & class
    console.log('[ClientHome] joining with', { name, class: selectedClass });
    // In a real app you would probably store a playerKey in
    // localStorage and navigate to the next screen automatically.
  }

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleJoin}>
        <h1 className={styles.title}>Join the Game</h1>
        <div className={styles.field}>
          <Label htmlFor="playerName" required>Name</Label>
          <Input
            id="playerName"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <Label required>Select your class</Label>
          <ClassPicker value={selectedClass} onChange={setSelectedClass} />
        </div>
        <div className={styles.actions}>
          <Button type="submit" label="Join" />
        </div>
      </form>
    </div>
  );
}