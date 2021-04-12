import { ethers } from "ethers";

export interface PostCommitVote {
  identifier: Uint8Array;
  time: number;
  ancillaryData: string;
  hash: string;
  encryptedVote: string;
}

export const postCommitVotes = async (
  contract: ethers.Contract,
  data: PostCommitVote[]
) => {
  try {
    const tx = await contract.functions[
      "batchCommit((bytes32,uint256,bytes,bytes32,bytes)[])"
    ](data);
    console.log("commit votes TX?", tx);
    return tx;
  } catch (err) {
    console.log("Err in attempted commitVote transaction", err);
  }
};