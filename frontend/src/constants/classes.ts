import { GameClass, getDifficultyByName } from '../client/models';

export const GameClasses: GameClass[] = [
  {
    name: 'Russian',
    description: 'If he is drinking Vodka, he can opt out of drinking 2 times.',
    difficulty: getDifficultyByName('Easy'),
    imageSrc: 'classes/russian_new.png'
  },
  {
    name: 'Pirate',
    description: 'If he is drinking Rum, he can opt out of drinking 2 times.',
    difficulty: getDifficultyByName('Easy'),
    imageSrc: 'classes/pirate_new.png'
  },
  {
    name: 'Drink Girlie',
    description: 'If she is drinking Drinks, she can opt out of drinking 2 times.',
    difficulty: getDifficultyByName('Easy'),
    imageSrc: 'classes/drink_girlie.png'
  },
  {
    name: 'Warrior',
    description: 'You are 3 times stronger in alcoholic battles.',
    difficulty: getDifficultyByName('Medium'),
    imageSrc: 'classes/warrior.png'
  },
  {
    name: 'Stokar',
    description: 'Is fucking stupid and doesnt\' get punished when failing puzzles. (Once per puzzle event!)',
    difficulty: getDifficultyByName('Medium'),
    imageSrc: 'classes/stokar.png'
  },
  {
    name: 'Controlfreak',
    description: 'Your votes are 3 times as strong.',
    difficulty: getDifficultyByName('Hard'),
    imageSrc: 'classes/controlfreak_new.png'
  },
  {
    name: 'Drunkard',
    description: 'Drinks for fun. No buffs, no debuffs.',
    difficulty: getDifficultyByName('Hard'),
    imageSrc: 'classes/drunkard.png'
  },
  {
    name: 'Mixer',
    description: 'Has to swap alcohol every 2 drinks, and can opt out of drinking 2 times.',
    difficulty: getDifficultyByName('Impossible'),
    imageSrc: 'classes/mixer.png'
  },
];

export function getClassByName(name: string): GameClass | undefined {
  return GameClasses.find(gameClass => gameClass.name === name);
}