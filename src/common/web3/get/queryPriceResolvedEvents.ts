import { ethers } from "ethers";
import assert from "assert";
import { VOTER_CONTRACT_BLOCK } from "common/config";

/*
event PriceResolved(
  uint256 indexed roundId,
  bytes32 indexed identifier,
  uint256 time,
  int256 price,
  bytes ancillaryData
);
*/

export interface PriceResolved {
  roundId: string;
  identifier: string;
  time: string;
  price: string;
}

export const queryPriceResolved = async (contract: ethers.Contract | null) => {
  assert(
    contract,
    "User is not connected to provider and cannot query contract."
  );

  // BIG NOTE. You need to pass in null for events with args.
  // Otherwise this will likely return no values.
  // PriceResolved(uint256,bytes32,uint256,int256,bytes)
  const filter = contract.filters.PriceResolved(null, null, null, null, null);

  try {
    const events = await contract.queryFilter(filter, VOTER_CONTRACT_BLOCK);

    return events.map((el) => {
      const { args } = el;
      const datum = {} as PriceResolved;
      if (args) {
        datum.roundId = args[0].toString();
        datum.identifier = ethers.utils.toUtf8String(args[1]);
        datum.time = args[2].toString();
        datum.price = ethers.utils.formatEther(args[3]);
      }

      return datum;
    });
  } catch (err) {
    console.log("err", err);
  }
};
