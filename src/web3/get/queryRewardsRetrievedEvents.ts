import { ethers } from "ethers";
import { VoteEvent } from "../types.web3";
import assert from "assert";
import { VOTER_CONTRACT_BLOCK } from "common/config";

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

    return events.map((el) => {
      const { args } = el;
      const datum = {} as RewardsRetrieved;
      if (args) {
        datum.address = args[0];
        datum.roundId = args[1].toString();
        datum.identifier = ethers.utils.toUtf8String(args[2]);
        datum.time = args[3].toString();
        datum.numTokens = args[5].toString();
      }

      return datum;
    });
  } catch (err) {
    console.log("err", err);
  }
};
