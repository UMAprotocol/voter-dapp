import { useContext } from "react";
import provider from "common/utils/web3/createProvider";
import createVoidSignerVotingContractInstance from "web3/createVoidSignerVotingContractInstance";

import determineBlockchainNetwork from "web3/helpers/determineBlockchainNetwork";

import { useQuery } from "react-query";

import { queryVoteTiming } from "web3/get/queryVoteTiming";
import { ErrorContext } from "common/context/ErrorContext";

const contract = createVoidSignerVotingContractInstance(
  provider,
  determineBlockchainNetwork()
);

// This can be accessed without logging the user in.
export default function useVoteTiming() {
  const { addError } = useContext(ErrorContext);

  const { data, error, isFetching, refetch } = useQuery<string>(
    "voteTiming",
    () => {
      return queryVoteTiming(contract)
        .then((res) => {
          if (res) {
            return res;
          } else {
            return "";
          }
        })
        .catch((err) => {
          addError(err.message);
          return "";
        });
    }
  );

  if (data) {
    return { data, error, isFetching, refetch };
  } else {
    return { data: "", error, isFetching };
  }
}
