import { ethers } from "ethers";
export const queryCurrentRoundId = async (contract: ethers.Contract) => {
  try {
    const roundId = await contract.functions.getCurrentRoundId();
    if (roundId.length) {
      const roundIdToString = ethers.BigNumber.from(roundId[0]).toString();
      return roundIdToString;
    }
  } catch (err) {
    console.error("err", err);
  }
};
