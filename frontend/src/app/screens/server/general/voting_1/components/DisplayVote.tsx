import React from "react";
import Label from "@/components/general/Label";
import styles from "./DisplayVote.module.css";
import { VoteOptionsWithPlayersAndResult } from "@/util/voting";
import DisplayPlayer from "@/components/specific/DisplayPlayer";

interface DisplayVoteProps {
  vote: VoteOptionsWithPlayersAndResult;
  allVotes?: VoteOptionsWithPlayersAndResult[];
}

const DisplayVote: React.FC<DisplayVoteProps> = ({ vote, allVotes }) => {
  const { voteOption, players, score } = vote;

  return (
    <div
      className={styles.voteOption}
      style={{
        left: `${voteOption.position.x}%`,
        top: `${voteOption.position.y}%`,
      }}
    >
      <Label className={styles.label}>{voteOption.text}</Label>
      { allVotes?.find((vote) => vote.score > 0) && (<div className={styles.results}>
        <span className={styles.score}>Score: {score}</span>
        <div className={styles.playersList}>
          {players.map((player, index) => (
            <DisplayPlayer key={index} player={player} width="2rem" height="2rem" />
          ))}
        </div>
      </div>
      )}
    </div>
  );
};

export default DisplayVote;