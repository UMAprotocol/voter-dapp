import { useContext } from "react";
import { useQuery } from "react-query";
import {
  queryPriceRequestAdded,
  PriceRequestAdded,
} from "common/web3/get/queryPriceRequestAddedEvents";

import provider from "common/utils/web3/createProvider";
import createVoidSignerVotingContractInstance from "common/web3/createVoidSignerVotingContractInstance";
import determineBlockchainNetwork from "common/web3/helpers/determineBlockchainNetwork";
import { ErrorContext } from "common/context/ErrorContext";

const contract = createVoidSignerVotingContractInstance(
  provider,
  determineBlockchainNetwork()
);

export default function usePriceRequestAddedEvents() {
  const { addError } = useContext(ErrorContext);
  const { data, error, isFetching } = useQuery<
    PriceRequestAdded[] | undefined | void
  >(
    "priceRequestAdded",
    () => {
      return queryPriceRequestAdded(contract)
        .then((res) => res)
        .catch((err) => addError(err));
    },
    { enabled: contract !== null }
  );

  return { data, error, isFetching };
}
