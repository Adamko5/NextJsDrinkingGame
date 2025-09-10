import { Player, Snapshot } from "@/client/models";
import { getPlayerByKey } from "./util";

export interface VoteOption {
  text: string;
  position: { x: number; y: number }; // percentage positions
}

export const optionsLeftRight: VoteOption[] = [
  { text: "Left", position: { x: 30, y: 50 } },
  { text: "Right", position: { x: 70, y: 50 } },
];

export type VoteOptionsWithPlayersAndResult = {
  voteOption: VoteOption;
  players: Player[];
  score: number;
}

export function matchPlayersToOptions(
  snapshot: Snapshot | null,
  options: VoteOption[]
): VoteOptionsWithPlayersAndResult[] {
  if (!snapshot) {
    return options.map(option => ({
      voteOption: option,
      players: [],
      score: 0,
    }));
  }

  return options.map(option => {
    const players: Player[] = [];
    let score = 0;

    Object.entries(snapshot.votes).forEach(([playerKey, vote]) => {
      if (vote.forOption === option.text) {
        const player = getPlayerByKey(playerKey, snapshot.players);
        if (player) {
          players.push(player);
          score += (player.gameClass.name === "Controlfreak") ? 3 : 1;
        }
      }
    });

    return {
      voteOption: option,
      players,
      score,
    };
  });
}