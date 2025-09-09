"use client";

import { optionsLeftRight } from "@/app/screens/general/voting/Intro";
import ClientVoting1 from "../general/voting_1/Voting1";

export default function ClientVotingPathIntro() {  
  return (
    <ClientVoting1 options={optionsLeftRight}></ClientVoting1>
  );
}