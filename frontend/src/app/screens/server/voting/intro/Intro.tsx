"use client";

import { optionsLeftRight } from "@/util/voting";
import ServerVoting1 from "../../general/voting_1/Voting1";

export default function VotingPathIntro() {  
  
  // TODO use a state here to see if voting was finished
  // if yes, show an animation for voting finished
  // then, show next video animation of walking in the forest
  // then, transition to next game state

  return (
    <ServerVoting1 options={optionsLeftRight}/>
  );
}