import { lobbyClient } from '@/client/api';
import { Player } from '../client/models';

export function getPlayerByKey(playerKey: string, players: Player[]): Player | undefined {
  return players.find(player => player.playerKey === playerKey);
}

export const handleAdvancePhase = async () => {
  try {
    await lobbyClient.advancePhase();
  } catch (error) {
    console.error('Failed to advance phase:', error);
  }
};