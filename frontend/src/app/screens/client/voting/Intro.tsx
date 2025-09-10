"use client";

import { optionsLeftRight } from "@/util/voting";
import ClientVoting1 from "../general/voting_1/Voting1";

export default function ClientVotingPathIntro() {  
  return (
    <ClientVoting1 options={optionsLeftRight}></ClientVoting1>
  );
}