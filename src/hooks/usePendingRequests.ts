import { useContext } from "react";
import provider from "common/utils/web3/createProvider";
import createVoidSignerVotingContractInstance from "web3/createVoidSignerVotingContractInstance";

import determineBlockchainNetwork from "web3/helpers/determineBlockchainNetwork";

import { useQuery } from "react-query";

import {
  queryGetPendingRequests,
  PendingRequest,
} from "web3/get/queryGetPendingRequests";
import { ErrorContext } from "common/context/ErrorContext";

const contract = createVoidSignerVotingContractInstance(
  provider,
  determineBlockchainNetwork()
);

// This can be accessed without logging the user in.
export default function usePendingRequests() {
  const { addError } = useContext(ErrorContext);
  const { data, error, isFetching, refetch } = useQuery<
    PendingRequest[] | undefined | void
  >(
    "pendingRequests",
    () => {
      return queryGetPendingRequests(contract)
        .then((res) => res)
        .catch((err) => addError(err));
    },
    {
      retry: false,
    }
  );

  return { data, error, isFetching, refetch };
}
