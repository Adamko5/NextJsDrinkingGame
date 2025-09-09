export interface VoteOption {
  text: string;
  position: { x: number; y: number }; // percentage positions
}

export const optionsLeftRight: VoteOption[] = [
  { text: "Left", position: { x: 30, y: 50 } },
  { text: "Right", position: { x: 70, y: 50 } },
];
