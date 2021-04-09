import provider from "common/utils/web3/createProvider";
import createVoidSignerVotingContractInstance from "web3/createVoidSignerVotingContractInstance";
import { useQuery } from "react-query";

import {
  queryGetPendingRequests,
  PendingRequest,
} from "web3/queryVotingContractMethods";

const contract = createVoidSignerVotingContractInstance(
  provider,
  process.env.REACT_APP_TESTING_GANACHE ? "1337" : "1"
);

// This can be accessed without logging the user in.
export default function usePendingRequests() {
  const { data, error, isFetching, refetch } = useQuery<PendingRequest[]>(
    "pendingRequests",
    () => {
      return queryGetPendingRequests(contract).then((res) => {
        if (res) {
          return res;
        } else {
          return [];
        }
      });
    }
  );

  if (data) {
    return { data, error, isFetching, refetch };
  } else {
    return { data: [] as PendingRequest[], error, isFetching };
  }
}
