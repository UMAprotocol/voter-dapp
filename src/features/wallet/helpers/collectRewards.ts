import { Dispatch, SetStateAction } from "react";
import { ethers } from "ethers";
import { RewardsRetrieved } from "web3/get/queryRewardsRetrievedEvents";
import {
  PostRetrieveReward,
  PendingRequestRetrieveReward,
} from "web3/post/retrieveRewards";
import { retrieveRewards } from "web3/post/retrieveRewards";

import VotingArtifact from "@uma/core/build/contracts/Voting.json";

const DEFAULT_BALANCE = "0";

// This interface is defined because we are going to batch the requests using the multicallContract: (https://github.com/UMAprotocol/protocol/blob/master/packages/core/contracts/common/interfaces/Multicall.sol)
interface MulticallCollectRewards {
  // contract address
  target: string;
  callData: string;
}

export default function collectRewards(
  contract: ethers.Contract,
  data: RewardsRetrieved[],
  // Type returned by useState variable in Wallet.tsx
  setAvailableRewards: Dispatch<SetStateAction<string>>,
  multicallContract: ethers.Contract
) {
  const multicallCollectRewards = [] as MulticallCollectRewards[];
  const votingInterface = new ethers.utils.Interface(VotingArtifact.abi);
  console.log("data", data);
  // find the unique roundIds
  const uniqueRoundIds = data
    .map((item) => item.roundId)
    .filter((value, index, self) => self.indexOf(value) === index);
  console.log("UNIQUE ROUND IDS", uniqueRoundIds);
  // Do a multicall request if the user is collecting from multiple rounds.
  // Otherwise just call the rewards function directly.
  if (uniqueRoundIds.length > 1) {
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
          pendingRequest.identifier = ethers.utils.toUtf8Bytes(
            datum.identifier
          );
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

    return (
      multicallContract.functions["aggregate((address,bytes)[])"](
        multicallCollectRewards
      )
        // wait for at least 1 block conf.
        .then((tx) => tx.wait(1))
        .then((conf: any) => {
          setAvailableRewards(DEFAULT_BALANCE);
        })
        .catch((err) => console.log("err in retrieve rewards", err))
    );
  } else {
    console.log("in this else. no MCR");
    const postData = {} as PostRetrieveReward;
    const pendingRequestData = [] as PendingRequestRetrieveReward[];

    uniqueRoundIds.forEach((roundId) => {
      data.forEach((datum) => {
        if (datum.roundId === roundId) {
          const pendingRequest = {} as PendingRequestRetrieveReward;
          postData.roundId = datum.roundId;
          postData.voterAddress = datum.address;
          pendingRequest.ancillaryData = datum.ancillaryData
            ? datum.ancillaryData
            : "0x";
          pendingRequest.identifier = ethers.utils.toUtf8Bytes(
            datum.identifier
          );
          pendingRequest.time = datum.time;
          pendingRequestData.push(pendingRequest);
        }
      });

      postData.pendingRequests = pendingRequestData;
    });

    return retrieveRewards(contract, postData)
      .then((tx) => tx.wait(1))
      .then((conf: any) => {
        setAvailableRewards(DEFAULT_BALANCE);
      })
      .catch((err) => console.log("err in retrieve rewards", err));
  }
}
