import { ethers } from "ethers";
import { VoteEvent } from "../types.web3";
import assert from "assert";
import { VOTER_CONTRACT_BLOCK } from "common/config";
import { OLD_VOTING_CONTRACT_ADDRESSES } from "common/config";
import provider from "common/utils/web3/createProvider";
import createOldVotingContractInstance from "web3/createOldVotingContractInstance";

/*
  event RewardsRetrieved(
    address indexed voter,
    uint256 indexed roundId,
    bytes32 indexed identifier,
    uint256 time,
    bytes ancillaryData,
    uint256 numTokens
  );
*/

export interface RewardsRetrieved extends VoteEvent {
  numTokens: string;
  ancillaryData: string;
}

export const queryRewardsRetrieved = async (
  contract: ethers.Contract | null,
  address: string | null
) => {
  assert(
    contract,
    "User is not connected to provider and cannot query contract."
  );

  // BIG NOTE. You need to pass in null for events with args.
  // Otherwise this will likely return no values.
  // RewardsRetrieved(address,uint256,bytes32,uint256,bytes,uint256)
  const filter = contract.filters.RewardsRetrieved(
    address,
    null,
    null,
    null,
    null,
    null
  );

  try {
    const events = await contract.queryFilter(filter, VOTER_CONTRACT_BLOCK);
    let rewards = events.map((el) => {
      const { args } = el;
      const datum = {} as RewardsRetrieved;
      if (args) {
        datum.address = args[0];
        datum.roundId = args[1].toString();
        datum.identifier = ethers.utils.toUtf8String(args[2]);
        datum.time = args[3].toString();
        datum.ancillaryData = args[4];
        datum.numTokens = args[5].toString();
      }

      return datum;
    });

    // On mainnet, look back at old voting contracts to retrieve rewards
    // for voters who have voted on previous iteration of the contract.
    // this is largely just for summation of Total UMA Collected.
    if (
      process.env.REACT_APP_CURRENT_ENV === "main" ||
      process.env.REACT_APP_CURRENT_ENV === undefined
    ) {
      const promises = OLD_VOTING_CONTRACT_ADDRESSES.map(async (addr) => {
        const oldContract = createOldVotingContractInstance(
          new ethers.VoidSigner(addr, provider),
          addr
        );
        const oldFilter = oldContract.filters.RewardsRetrieved(
          address,
          null,
          null,
          null,
          null
        );

        const oldEvents = await oldContract.queryFilter(oldFilter, 0);
        const oldRewards = oldEvents.map((el) => {
          const { args } = el;
          const datum = {} as RewardsRetrieved;
          if (args) {
            datum.address = args[0];
            datum.roundId = args[1].toString();
            datum.identifier = ethers.utils.toUtf8String(args[2]);
            datum.time = args[3].toString();
            datum.numTokens = args[4].toString();
            // Anc didn't exist -- normalize to new data and set default.
            datum.ancillaryData = "0x";
          }

          return datum;
        });

        return oldRewards;
      });

      return Promise.all(promises).then((results) => {
        const flatten = results.flat();
        return [...rewards, ...flatten];
      });
    }
    return rewards;
  } catch (err) {
    console.log("err", err);
  }
};
