import { ethers } from "ethers";

export interface PostCommitVote {
  identifier: Uint8Array;
  time: number;
  ancillaryData: string;
  hash: string;
  encryptedVote: string;
  // encryptedVote: number[];
}

export const postCommitVotes = async (
  contract: ethers.Contract,
  data: PostCommitVote[]
) => {
  try {
    const tx = await contract.functions[
      "batchCommit((bytes32,uint256,bytes,bytes32,bytes)[])"
    ](data);
    // console.log("commit votes TX?", tx);
    return tx;
  } catch (err) {
    console.log("Err in attempted commitVote transaction", err);
  }
};

export const snapshotCurrentRound = async (
  contract: ethers.Contract,
  signature: string
) => {
  try {
    const tx = await contract.functions["snapshotCurrentRound(bytes)"](
      signature
    );
    // console.log("Snapshot worked?", tx);
    return tx;
  } catch (err) {
    console.log("err in Snapshot", err);
  }
};

export interface PostRevealData {
  time: number;
  price: ethers.BigNumber;
  ancillaryData: string; // hexstring
  // salt: ethers.BigNumber; // signed int
  salt: string;
  identifier: Uint8Array;
}

/*
  bytes32 identifier,
  uint256 time,
  int256 price,
  bytes memory ancillaryData,
  int256 salt
*/

export const revealVotes = async (
  contract: ethers.Contract,
  data: PostRevealData[]
) => {
  try {
    const tx = await contract.functions[
      "batchReveal((bytes32,uint256,int256,bytes,int256)[])"
    ](data);
    // console.log("successfully Revealed", tx);
    return tx;
  } catch (err) {
    console.log("err in Reveal votes", err);
  }
};
