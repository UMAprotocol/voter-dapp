import { useContext } from "react";
import provider from "common/utils/web3/createProvider";
import createVotingContractInstance from "web3/createVotingContractInstance";
import { useQuery } from "react-query";

import determineBlockchainNetwork from "web3/helpers/determineBlockchainNetwork";

import {
  queryPriceRoundEvents,
  PriceRound,
} from "web3/get/queryPriceRoundEvents";
import { ErrorContext } from "common/context/ErrorContext";

const signer = provider.getSigner();
const contract = createVotingContractInstance(
  signer,
  determineBlockchainNetwork()
);

// This can be accessed without logging the user in.
export default function usePriceRoundEvents() {
  const { addError } = useContext(ErrorContext);

  const { data, error, isFetching } = useQuery<PriceRound[] | undefined | void>(
    "priceRoundEvents",
    () => {
      return queryPriceRoundEvents(contract)
        .then((res) => res)
        .catch((err) => addError(err));
    }
  );

  return { data, error, isFetching };
}
