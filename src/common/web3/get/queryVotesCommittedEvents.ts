import { ethers } from "ethers";
import { VOTER_CONTRACT_BLOCK } from "common/config";
import assert from "assert";

import { VoteEvent } from "../types.web3";

/*  event VoteCommitted(
  address indexed voter,
  uint256 indexed roundId,
  bytes32 indexed identifier,
  uint256 time,
  bytes ancillaryData
);
*/
export const queryVotesCommittedEvents = async (
  contract: ethers.Contract | null,
  address: string | null = null,
  roundId: string | null = null,
  identifier: string | null = null,
  time: number | null = null
) => {
  assert(
    contract,
    "User is not connected to provider and cannot query contract."
  );

  // BIG NOTE. You need to pass in null for events with args.
  // Otherwise this will likely return no values.
  // VoteCommmited: (address,uint256,bytes32,uint256,bytes)
  const filter = contract.filters.VoteCommitted(
    address,
    roundId,
    identifier,
    time,
    null
  );

  try {
    const events = await contract.queryFilter(
      filter,

      VOTER_CONTRACT_BLOCK
    );
    return events.map((el) => {
      const { args } = el;
      const datum = {} as VoteEvent;
      if (args) {
        datum.address = args[0];
        datum.roundId = args[1].toString();
        datum.identifier = ethers.utils.toUtf8String(args[2]);
        datum.time = args[3].toString();
      }

      return datum;
    });
  } catch (err) {
    console.log("err", err);
  }
};
