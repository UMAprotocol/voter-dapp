import { ethers } from "ethers";
import assert from "assert";
import { VOTER_CONTRACT_BLOCK } from "common/config";

export interface PriceRequestAdded {
  roundId: string;
  identifier: string;
  time: string;
}

export const queryPriceRequestAdded = async (
  contract: ethers.Contract | null
) => {
  assert(
    contract,
    "User is not connected to provider and cannot query contract."
  );

  // BIG NOTE. You need to pass in null for events with args.
  // Otherwise this will likely return no values.
  // PriceRequestAdded(uint256,bytes32,uint256)
  const filter = contract.filters.PriceRequestAdded(null, null, null);

  console.log("voterContractblock", VOTER_CONTRACT_BLOCK, "contract", contract);
  try {
    const events = await contract.queryFilter(filter, VOTER_CONTRACT_BLOCK);
    // console.log("events", events);
    return events.map((el) => {
      const { args } = el;
      const datum = {} as PriceRequestAdded;
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
