import { ethers } from "ethers";

export interface PostRetrieveReward {
  voterAddress: string;
  roundId: string;
  pendingRequests: PendingRequestRetrieveReward[];
}

export interface PendingRequestRetrieveReward {
  // hexstring
  ancillaryData: string;
  // bytes32: hexstring or UIntArray
  identifier: Uint8Array | string;
  // uint.
  time: string | number;
}

/**
 * @notice Retrieves rewards owed for a set of resolved price requests.
 * @dev Can only retrieve rewards if calling for a valid round and if the call is done within the timeout threshold
 * (not expired). Note that a named return value is used here to avoid a stack to deep error.
 * @param voterAddress voter for which rewards will be retrieved. Does not have to be the caller.
 * @param roundId the round from which voting rewards will be retrieved from.
 * @param toRetrieve array of PendingRequests which rewards are retrieved from.
 * @return totalRewardToIssue total amount of rewards returned to the voter.
 */

export const retrieveRewards = async (
  contract: ethers.Contract,
  data: PostRetrieveReward
) => {
  console.log("data in RR", data);
  try {
    const tx = await contract.functions[
      "retrieveRewards(address,uint256,(bytes32,uint256,bytes)[])"
    ](data.voterAddress, data.roundId, data.pendingRequests);
    console.log("retrieve rewards TX?", tx);
    return tx;
  } catch (err) {
    console.log("Err in attempted retrieveRewards transaction", err);
  }
};
