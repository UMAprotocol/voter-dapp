import { ethers } from "ethers";
import { VoteEvent } from "../types.web3";
import assert from "assert";
import { VOTER_CONTRACT_BLOCK } from "common/config";
import * as utils from "common/utils/events";

export interface VoteRevealed extends VoteEvent {
  price: string;
  numTokens: string;
  idenHex: string;
  address: string;
}

export const queryVotesRevealedEvents = async (
  contract: ethers.Contract | null,
  address: string | null = null,
  roundId: string | null = null,
  identifier: string | null = null,
  time: number | null = null,
  price: number | null = null,
  numTokens: number | null = null
) => {
  assert(
    contract,
    "User is not connected to provider and cannot query contract."
  );

  // BIG NOTE. You need to pass in null for events with args.
  // Otherwise this will likely return no values.
  // VoteRevealed(address,uint256,bytes32,uint256,int256,bytes,uint256)
  const filter = contract.filters.VoteRevealed(
    address,
    roundId && ethers.BigNumber.from(roundId),
    identifier,
    time,
    price,
    null,
    numTokens
  );
  let events = [];
  let rangeState = utils.rangeStart({
    startBlock: VOTER_CONTRACT_BLOCK,
    endBlock: await contract.provider.getBlockNumber(),
  });
  while (!rangeState.done) {
    try {
      const newEvents = await contract.queryFilter(
        filter,
        rangeState.currentStart,
        rangeState.currentEnd
      );
      rangeState = utils.rangeSuccessDescending(rangeState);
      events.push(...newEvents);
    } catch (err) {
      rangeState = utils.rangeFailureDescending(rangeState);
    }
  }
  return events.map((el) => {
    const { args } = el;
    const datum = {} as VoteRevealed;
    if (args) {
      datum.address = args[0];
      datum.roundId = args[1].toString();
      datum.identifier = ethers.utils.toUtf8String(args[2]);
      datum.idenHex = args[2];
      datum.time = args[3].toString();
      datum.price = ethers.utils.formatEther(args[4]);
      datum.ancillaryData = args[5];
      datum.numTokens = args[6].toString();
    }

    return datum;
  });
};
