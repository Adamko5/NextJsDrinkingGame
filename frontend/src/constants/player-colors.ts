// This file defines a palette of distinct colours used to
// represent players throughout the application.  The backend
// stores a colour string for each player so keeping a central
// definition ensures consistency between the frontend and
// backend.

// Each entry provides a human‑readable name and its
// corresponding hexadecimal colour code (without the leading
// hash).  Colours were chosen to be visually distinct to avoid
// confusion when many players are displayed together.  If you
// adjust these values be sure to maintain sufficient contrast
// against backgrounds and other UI elements.

export interface PlayerColor {
  /** Descriptive name of the colour. */
  name: string;
  /** Hexadecimal representation of the colour (without '#'). */
  code: string;
}

// An array of ten distinct colours for players.  Additional
// colours can be appended as needed but the first ten should
// provide clear differentiation.
export const PlayerColors: PlayerColor[] = [
  { name: 'Red',    code: 'E74C3C' }, // bright red
  { name: 'Orange', code: 'E67E22' }, // vivid orange
  { name: 'Yellow', code: 'F1C40F' }, // warm yellow
  { name: 'Green',  code: '2ECC71' }, // mid green
  { name: 'Blue',   code: '3498DB' }, // sky blue
  { name: 'Purple', code: '9B59B6' }, // medium purple
  { name: 'Pink',   code: 'E91E63' }, // hot pink
  { name: 'Teal',   code: '1ABC9C' }, // teal
  { name: 'Brown',  code: '8B4513' }, // rich brown
  { name: 'Grey',   code: '95A5A6' }, // neutral grey
];

/**
 * Returns a colour definition by its name.  If no colour
 * matches the supplied name this function returns undefined.
 *
 * @param name The name of the desired colour
 */
export function getColorByName(name: string): PlayerColor | undefined {
  return PlayerColors.find((c) => c.name === name);
}