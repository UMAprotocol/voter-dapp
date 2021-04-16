import { ethers } from "ethers";

export interface PostCommitVote {
  identifier: string | Uint8Array;
  time: string | ethers.BigNumber | number;
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
  time: string | number;
  price: string;
  ancillaryData: string; // hexstring
  salt: string;
  identifier: string;
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
  console.log("contract", contract);
  console.log("data in RV", data);
  try {
    const tx = await contract.functions[
      "batchReveal((bytes32,uint256,int256,bytes,int256)[])"
    ]([data[2]]);
    // const tx = await contract.functions[
    //   "revealVote(bytes32,uint256,int256,bytes,int256)"
    // ](
    //   data[0].identifier,
    //   data[0].time,
    //   data[0].price,
    //   data[0].ancillaryData,
    //   data[0].salt
    // );
    console.log("successfully Revealed", tx);
    return tx;
  } catch (err) {
    console.log("err in Reveal votes", err);
  }
};
