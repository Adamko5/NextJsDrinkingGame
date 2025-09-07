/**
 * Represents a single segment of narrative shown on the story telling screen.
 * Each StoryLine contains the text to display and the duration (in
 * milliseconds) for which the text should remain on screen before
 * automatically advancing to the next entry.
 */
export interface StoryLine {
  /**
   * The text displayed on the screen.  This can include any
   * narrative content and should be kept relatively short so that
   * players can read it comfortably within the allotted time.
   */
  text: string;
  /**
   * The time in milliseconds that this story line should remain
   * visible.  When this duration elapses the screen will
   * automatically show the next StoryLine in the sequence.
   */
  screenTime: number;
}