import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { MAINNET_DEPLOY_BLOCK } from "common/config";

export interface PriceRound {
  roundId: string;
  identifier: string;
  time: string;
}

const queryPriceRoundEvents = async (
  contract: ethers.Contract,
  setState: Function
) => {
  // BIG NOTE. You need to pass in null for events with args.
  // Otherwise this will likely return no values.
  const priceRequestFilter = contract.filters.PriceRequestAdded(
    null,
    null,
    null
  );

  const events = await contract.queryFilter(
    priceRequestFilter,
    MAINNET_DEPLOY_BLOCK
  );

  const pr = events.map((el) => {
    const { args } = el;
    const datum = {} as PriceRound;
    if (args) {
      datum.roundId = args[0].toString();
      datum.identifier = ethers.utils.toUtf8String(args[1]);
      datum.time = args[2].toString();
    }
    return datum;
  });
  setState(pr);
};

export default function usePriceRounds(contract: ethers.Contract | null) {
  const [priceRounds, setPriceRounds] = useState<PriceRound[]>([]);
  useEffect(() => {
    if (contract) {
      queryPriceRoundEvents(contract, setPriceRounds);

      try {
      } catch (err) {
        console.log("err", err);
      }
    }
  }, [contract]);

  return { priceRounds };
}
