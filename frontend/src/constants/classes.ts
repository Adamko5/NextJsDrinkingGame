import { GameClass } from '../client/models';

export const GameClasses: GameClass[] = [
  {
    name: 'Russian',
    description: 'Can drink half of what he has to, if he is drinking Vodka.',
    imageSrc: 'classes/russian.png'
  },
  {
    name: 'Pirate',
    description: 'Can drink half of what he has to, if he is drinking Rum.',
    imageSrc: 'classes/pirate.png'
  },
  {
    name: 'Controlfreak',
    description: 'Your votes are twice as strong.',
    imageSrc: 'classes/controlfreak.png'
  }
];

export function getClassByName(name: string): GameClass | undefined {
  return GameClasses.find(gameClass => gameClass.name === name);
}