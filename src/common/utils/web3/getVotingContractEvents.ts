import { ethers } from "ethers";
import { MAINNET_DEPLOY_BLOCK } from "common/config";

import stringToBytes32 from "common/utils/stringToBytes32";

export interface PriceRound {
  roundId: string;
  identifier: string;
  time: string;
}

export const queryPriceRoundEvents = async (
  contract: ethers.Contract,
  roundId: number | null = null,
  identifier: string | null = null,
  time: number | null = null
) => {
  // Convert identifier from string to Bytes32.
  let bytesIdentifier: Uint8Array | null = null;
  if (identifier) {
    bytesIdentifier = stringToBytes32(identifier);
  }
  // BIG NOTE. You need to pass in null for events with args.
  // Otherwise this will likely return no values.
  // PriceRequestAdded(uint256 indexed roundId, bytes32 indexed identifier, uint256 time)

  const priceRequestFilter = contract.filters.PriceRequestAdded(
    roundId,
    bytesIdentifier,
    time
  );

  try {
    const events = await contract.queryFilter(
      priceRequestFilter,
      MAINNET_DEPLOY_BLOCK
    );

    return events.map((el) => {
      const { args } = el;
      const datum = {} as PriceRound;
      if (args) {
        datum.roundId = args[0].toString();
        datum.identifier = ethers.utils.toUtf8String(args[1]);
        datum.time = args[2].toString();
      }
      return datum;
    });
  } catch (err) {
    console.log("err", err);
  }
};
