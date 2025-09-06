import { Player } from '../client/models';

export function getPlayerByKey(playerKey: string, players: Player[]): Player | undefined {
  return players.find(player => player.playerKey === playerKey);
}