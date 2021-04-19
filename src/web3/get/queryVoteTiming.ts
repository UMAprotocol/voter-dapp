import { ethers } from "ethers";

export const queryVoteTiming = async (contract: ethers.Contract) => {
  try {
    const timing = await contract.functions.voteTiming();
    if (timing.length) {
      const timingToString = ethers.BigNumber.from(timing[0]).toString();
      return timingToString;
    }
  } catch (err) {
    console.log("err", err);
  }
};
