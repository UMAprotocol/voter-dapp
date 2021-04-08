import provider from "common/utils/web3/createProvider";
import createVotingContractInstance from "web3/createVotingContractInstance";
import { useQuery } from "react-query";

import {
  queryPriceRoundEvents,
  PriceRound,
} from "web3/queryVotingContractEvents";

const signer = provider.getSigner();
const contract = createVotingContractInstance(
  signer,
  process.env.REACT_APP_TESTING_GANACHE ? "1337" : "1"
);

// This can be accessed without logging the user in.
export default function usePriceRoundEvents() {
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
    return { data, error, isFetching };
  } else {
    return { data: [] as PriceRound[], error, isFetching };
  }
}
