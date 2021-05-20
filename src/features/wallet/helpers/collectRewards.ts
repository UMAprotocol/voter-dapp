import { ethers } from "ethers";
import { RewardsRetrieved } from "web3/get/queryRewardsRetrievedEvents";
import {
  PostRetrieveReward,
  PendingRequestRetrieveReward,
} from "web3/post/retrieveRewards";
import { retrieveRewards } from "web3/post/retrieveRewards";

import VotingArtifact from "@uma/core/build/contracts/Voting.json";

// This interface is defined because we are going to batch the requests using the multicallContract: (https://github.com/UMAprotocol/protocol/blob/master/packages/core/contracts/common/interfaces/Multicall.sol)
interface MulticallCollectRewards {
  // contract address
  target: string;
  callData: string;
}

export default function collectRewards(
  contract: ethers.Contract,
  data: RewardsRetrieved[],
  multicallContract: ethers.Contract
) {
  // find the unique roundIds
  const uniqueRoundIds = data
    .map((item) => item.roundId)
    .filter((value, index, self) => self.indexOf(value) === index);

  // Do a multicall request if the user is collecting from multiple rounds.
  // Otherwise just call the rewards function directly.
  if (uniqueRoundIds.length === 1) {
    const [roundId] = uniqueRoundIds;
    return collectSingleRoundRewards(data, roundId, contract);
  }
  return collectMultipleRoundRewards(
    data,
    uniqueRoundIds,
    contract,
    multicallContract
  );
}

// Query the contract direct to retrieve rewards if it's only for a single round to save on gas.
function collectSingleRoundRewards(
  data: RewardsRetrieved[],
  // Type returned by useState variable in Wallet.tsx,
  roundId: string,
  contract: ethers.Contract
) {
  const postData = {
    voterAddress: data[0].address,
    roundId,
  } as PostRetrieveReward;

  postData.pendingRequests = data
    .filter((datum) => datum.roundId === roundId)
    .map(
      (datum): PendingRequestRetrieveReward => ({
        ...datum,
        ancillaryData: datum.ancillaryData ? datum.ancillaryData : "0x",
        identifier: ethers.utils.toUtf8Bytes(datum.identifier),
      })
    );

  return retrieveRewards(contract, postData);
}

function collectMultipleRoundRewards(
  data: RewardsRetrieved[],
  // Type returned by useState variable in Wallet.tsx,
  uniqueRoundIds: string[],
  contract: ethers.Contract,
  multicallContract: ethers.Contract
) {
  const multicallCollectRewards = [] as MulticallCollectRewards[];
  const votingInterface = new ethers.utils.Interface(VotingArtifact.abi);

  uniqueRoundIds.forEach((roundId) => {
    const mcr = {} as MulticallCollectRewards;
    const postData = {} as PostRetrieveReward;
    const pendingRequestData = [] as PendingRequestRetrieveReward[];

    data.forEach((datum) => {
      if (datum.roundId === roundId) {
        const pendingRequest = {} as PendingRequestRetrieveReward;
        postData.roundId = datum.roundId;
        postData.voterAddress = datum.address;
        pendingRequest.ancillaryData = datum.ancillaryData
          ? datum.ancillaryData
          : "0x";
        pendingRequest.identifier = ethers.utils.toUtf8Bytes(datum.identifier);
        pendingRequest.time = datum.time;
        pendingRequestData.push(pendingRequest);
      }
    });

    postData.pendingRequests = pendingRequestData;
    mcr.target = contract.address;
    mcr.callData = votingInterface.encodeFunctionData(
      "retrieveRewards(address,uint256,(bytes32,uint256,bytes)[])",
      [postData.voterAddress, postData.roundId, postData.pendingRequests]
    );

    multicallCollectRewards.push(mcr);
  });

  return multicallContract.functions["aggregate((address,bytes)[])"](
    multicallCollectRewards
  );
}
