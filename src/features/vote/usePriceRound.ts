import provider from "common/utils/web3/createProvider";
import createVotingContractInstance from "common/utils/web3/createVotingContractInstance";
import { useQuery } from "react-query";

import {
  queryPriceRoundEvents,
  PriceRound,
} from "common/utils/web3/getVotingContractEvents";

const signer = provider.getSigner();
const contract = createVotingContractInstance(signer);

// This can be accessed without logging the user in.
export default function usePriceRound() {
  const { data } = useQuery<PriceRound[]>("priceRoundEvents", () => {
    return queryPriceRoundEvents(contract).then((res) => {
      if (res) {
        return res;
      } else {
        return [];
      }
    });
  });

  if (data) {
    return { priceRounds: data };
  } else {
    return { priceRounds: [] as PriceRound[] };
  }
}
