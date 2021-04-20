import { ethers } from "ethers";
import { RewardsRetrieved } from "web3/get/queryRewardsRetrievedEvents";
import {
  retrieveRewards,
  PostRetrieveReward,
  PendingRequestRetrieveReward,
} from "web3/post/retrieveRewards";

const DEFAULT_BALANCE = "0";

export default function collectRewards(
  contract: ethers.Contract,
  data: RewardsRetrieved[],
  setAvailableRewards: Function
) {
  const postData = {} as PostRetrieveReward;
  const pendingRequestData = [] as PendingRequestRetrieveReward[];

  postData.voterAddress = data[0].address;
  postData.roundId = data[0].roundId;
  data.forEach((el) => {
    const pendingRequest = {} as PendingRequestRetrieveReward;
    pendingRequest.ancillaryData = el.ancillaryData ? el.ancillaryData : "0x";
    pendingRequest.identifier = ethers.utils.toUtf8Bytes(el.identifier);
    pendingRequest.time = el.time;
    pendingRequestData.push(pendingRequest);
  });

  postData.pendingRequests = pendingRequestData;
  retrieveRewards(contract, postData).then((tx) => {
    tx.wait(1).then((conf: any) => {
      // This function should collect all available rewards. Set balance to 0.
      // Note: This still needs to be tested for N-1, N-2, ... rounds.
      setAvailableRewards(DEFAULT_BALANCE);
    });
  });
}
