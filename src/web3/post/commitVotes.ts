import { ethers } from "ethers";

export interface PostCommitVote {
  identifier: string | Uint8Array;
  time: string | ethers.BigNumber | number;
  ancillaryData: string;
  hash: string;
  encryptedVote: string;
  // encryptedVote: number[];
}

export const commitVotes = async (
  contract: ethers.Contract,
  data: PostCommitVote[]
) => {
  try {
    const tx = await contract.functions[
      "batchCommit((bytes32,uint256,bytes,bytes32,bytes)[])"
    ](data);

    return tx;
  } catch (err) {
    throw err;
  }
};
