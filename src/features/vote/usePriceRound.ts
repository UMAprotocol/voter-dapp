import provider from "common/utils/web3/createProvider";
import createVotingContractInstance from "web3/createVotingContractInstance";
import { useQuery } from "react-query";

import {
  queryPriceRoundEvents,
  PriceRound,
} from "web3/getVotingContractEvents";

const signer = provider.getSigner();
const contract = createVotingContractInstance(signer);

// This can be accessed without logging the user in.
export default function usePriceRound() {
  const { data, error, isFetching } = useQuery<PriceRound[]>(
    "priceRoundEvents",
    () => {
      return queryPriceRoundEvents(contract).then((res) => {
        if (res) {
          return res;
        } else {
          return [];
        }
      });
    }
  );

  if (data) {
    return { priceRounds: data, error, isFetching };
  } else {
    return { priceRounds: [] as PriceRound[], error, isFetching };
  }
}
