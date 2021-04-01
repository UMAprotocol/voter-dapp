import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { MAINNET_DEPLOY_BLOCK } from "common/config";

export interface PriceRound {
  roundId: string;
  identifier: string;
  time: string;
}

export default function usePriceRounds(contract: ethers.Contract | null) {
  const [priceRounds, setPriceRounds] = useState<PriceRound[]>([]);

  useEffect(() => {
    if (contract) {
      queryPriceRoundEvents(contract).then((data) => {
        if (data) setPriceRounds(data);
      });
    }
  }, [contract]);

  return { priceRounds };
}

const queryPriceRoundEvents = async (contract: ethers.Contract) => {
  // BIG NOTE. You need to pass in null for events with args.
  // Otherwise this will likely return no values.
  const priceRequestFilter = contract.filters.PriceRequestAdded(
    null,
    null,
    null
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
