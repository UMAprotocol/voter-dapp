import { useEffect, useState } from "react";
import provider from "common/utils/web3/createProvider";
import createVotingContractInstance from "common/utils/web3/createVotingContractInstance";

import {
  queryPriceRoundEvents,
  PriceRound,
} from "common/utils/web3/getVotingContractEvents";

const signer = provider.getSigner();
const contract = createVotingContractInstance(signer);

// This can be accessed without logging the user in.
export default function usePriceRound() {
  const [priceRounds, setPriceRounds] = useState<PriceRound[]>([]);

  useEffect(() => {
    queryPriceRoundEvents(contract).then((data) => {
      if (data) setPriceRounds(data);
    });
  }, []);

  return { priceRounds };
}
