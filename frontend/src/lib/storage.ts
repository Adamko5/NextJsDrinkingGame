/*
 * Lightweight wrappers around localStorage for persisting small bits of
 * information between refreshes. The join flow uses a `rejoinKey` to
 * reclaim a player identity, and we also cache form inputs on the client.
 */

export function getRejoinKey(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('rejoinKey');
  } catch (err) {
    return null;
  }
}

export function setRejoinKey(key: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('rejoinKey', key);
  } catch (err) {
    // Ignore
  }
}