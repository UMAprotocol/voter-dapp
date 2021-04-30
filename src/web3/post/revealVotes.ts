import { ethers } from "ethers";
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
  try {
    const tx = await contract.functions[
      "batchReveal((bytes32,uint256,int256,bytes,int256)[])"
    ](data);
    console.log("successfully Revealed", tx);
    return tx;
  } catch (err) {
    console.log("err in Reveal votes", err);
  }
};
