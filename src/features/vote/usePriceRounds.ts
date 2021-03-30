import { useEffect, useState } from "react";
import { ethers } from "ethers";
import VotingArtifact from "@uma/core/build/contracts/Voting.json";
import { Result } from "@ethersproject/abi";
console.log(VotingArtifact);
const ORIGINAL_BLOCK = 11876839;
interface Event {
  anonymous: Boolean;
  inputs: {
    indexed: Boolean;
    internalType: string;
    name: string;
    type: string;
  }[];
  name: string;
  type: string;
}

interface PriceRound {
  roundId: string;
  identifier: string;
  time: string;
}

export default async function usePriceRounds(contract: ethers.Contract | null) {
  const [priceRounds, setPriceRounds] = useState<PriceRound[]>([]);
  useEffect(() => {
    if (contract) {
      // BIG NOTE. You need to pass in null for events with args.
      // Otherwise this will likely return no values.
      const filter = contract.filters.PriceRequestAdded(null, null, null);

      console.log(filter);
      console.log(ethers.utils);
      const events = contract
        .queryFilter(filter, ORIGINAL_BLOCK)
        .then((events) => {
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
          setPriceRounds(pr);
        });

      try {
      } catch (err) {
        console.log("err", err);
      }
    }
  }, [contract]);
}
