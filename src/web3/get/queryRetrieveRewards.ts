import { ethers } from "ethers";
import stringToBytes32 from "common/utils/web3/stringToBytes32";

/**
 * @notice Retrieves rewards owed for a set of resolved price requests.
 * @dev Can only retrieve rewards if calling for a valid round and if the call is done within the timeout threshold
 * (not expired). Note that a named return value is used here to avoid a stack to deep error.
 * @param voterAddress voter for which rewards will be retrieved. Does not have to be the caller.
 * @param roundId the round from which voting rewards will be retrieved from.
 * @param toRetrieve array of PendingRequests which rewards are retrieved from.
 * @return totalRewardToIssue total amount of rewards returned to the voter.
 */

export const queryRetrieveRewards = async (
  contract: ethers.Contract,
  address: string,
  roundId: string,
  identifier: string,
  time: string
) => {
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
