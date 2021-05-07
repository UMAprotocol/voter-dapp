import { useContext, useEffect, useState } from "react";
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
  // const [isEnabled, setIsEnabled] = useState(true);
  const { data, error, isFetching, refetch } = useQuery<
    PendingRequest[],
    Error
  >(
    "pendingRequests",
    () => {
      return queryGetPendingRequests(contract).then((res) => {
        if (res) {
          return res;
        } else {
          return [];
        }
      });
    },
    {
      retry: false,
      // enabled: isEnabled,
      // onSuccess: () => {
      //   setIsEnabled(false);
      // },
    }
  );

  useEffect(() => {
    if (error) addError(error!.message);
  }, [error, addError]);

  if (data) {
    return { data, error, isFetching, refetch };
  } else {
    return { data: [] as PendingRequest[], error, isFetching };
  }
}
