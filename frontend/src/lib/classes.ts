export interface GameClass {
  id: string;
  name: string;
  description: string;
  imageSrc: string;
}

/**
 * A collection of pre-defined character classes for players to choose from.
 *
 * Each class describes a unique perk or rule that affects how the player drinks.
 * These are surfaced in the client join UI via a carousel-style picker.
 *
 * Note: Use the `id` property when sending the selection to the server. The
 * server will treat this field as the existing `trait` on the `JOIN` payload
 * without requiring any server-side changes.
 */
export const classes: GameClass[] = [
  {
    id: 'russian',
    name: 'Russian',
    description: 'Can drink half of what he has to, if he is drinking Vodka.',
    imageSrc: '/classes/russian.png',
  },
  {
    id: 'pirate',
    name: 'Pirate',
    description: 'Can drink half of what he has to, if he is drinking Rum.',
    imageSrc: '/classes/pirate.png',
  },
  {
    id: 'controlfreak',
    name: 'Controlfreak',
    description: 'Your votes are twice as strong.',
    imageSrc: '/classes/controlfreak.png',
  },
];

/**
 * Helper to find a class by its id.
 *
 * @param id The class identifier stored on a player.
 * @returns The matching GameClass or undefined if no match was found.
 */
export function getClassById(id: string): GameClass | undefined {
  return classes.find((c) => c.id === id);
}