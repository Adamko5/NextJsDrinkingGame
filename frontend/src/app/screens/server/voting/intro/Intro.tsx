"use client";

import { optionsLeftRight } from "@/app/screens/general/voting/Intro";
import ServerVoting1 from "../../general/voting_1/Voting1";

export default function VotingPathIntro() {  
  
  return (
    <ServerVoting1 options={optionsLeftRight}/>
  );
}