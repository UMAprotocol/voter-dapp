import { ethers } from "ethers";

export enum VotePhases {
  COMMIT,
  REVEAL,
}

export const queryGetVotePhase = async (contract: ethers.Contract) => {
  try {
    const phase: VotePhases[] = await contract.functions.getVotePhase();
    if (phase.length) {
      if (phase[0] === VotePhases.COMMIT) return "Commit";
      if (phase[0] === VotePhases.REVEAL) return "Reveal";
    } else {
      return "";
    }
  } catch (err) {
    console.log("err", err);
  }
};
