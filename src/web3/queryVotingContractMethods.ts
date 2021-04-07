import { ethers } from "ethers";
import stringToBytes32 from "common/utils/web3/stringToBytes32";

export const queryRetrieveRewards = async (
  contract: ethers.Contract,
  address: string,
  roundId: string,
  identifier: string,
  time: string
) => {
  console.log("roundId", roundId, "address", address);
  try {
    const reward: ethers.BigNumber = await contract.callStatic[
      "retrieveRewards(address,uint256,(bytes32,uint256)[])"
    ](address, Number(roundId), [
      { identifier: stringToBytes32(identifier), time: Number(time) },
    ]);
    return ethers.utils.formatEther(reward.toString());
  } catch (err) {
    console.log("err", err);
  }
};
