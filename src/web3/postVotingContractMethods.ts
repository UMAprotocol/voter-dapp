import { ethers } from "ethers";
import { FormData } from "features/vote/ActiveRequestsForm";

export interface PostCommitVote {
  identifier: Uint8Array;
  time: number;
  ancillaryData: string;
  hash: string;
}

export const commitVote = async (contract: ethers.Contract, data: any) => {
  console.log("whoop");
  try {
  } catch (err) {}
};
