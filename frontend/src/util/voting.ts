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

export function isVoteConcluded(snapshot: Snapshot | null): boolean {
  if (!snapshot) return false;

  const totalPlayers = snapshot.players.length;
  const votesCast = Object.keys(snapshot.votes).length;
  if (votesCast === totalPlayers) return true;

  return false;
}

export function getWinningOption(votes: VoteOptionsWithPlayersAndResult[]): VoteOptionsWithPlayersAndResult {
  const maxScore = Math.max(...votes.map(vote => vote.score));
  const winningVotes = votes.filter(vote => vote.score === maxScore && maxScore > 0);

  var winningVote = winningVotes[0];

  if (winningVotes.length !== 1) {
    const randomIndex = Math.floor(Math.random() * winningVotes.length);
    winningVote = winningVotes[randomIndex];
  }
  winningVote.voteOption.position.x = 50;
  winningVote.voteOption.position.y = 50;
  return winningVote;
}

export function getPlayersFromVoteKeys(snapshot: Snapshot | null) : Player[]{
  if (!snapshot) return [];
  const keys = Object.keys(snapshot.votes);
  
  const allPlayers = keys.map(key => snapshot.players.find(player => player.playerKey === key));

  const onlyFoundPlayers = allPlayers.filter(player => player != undefined);
  
  return onlyFoundPlayers;
}