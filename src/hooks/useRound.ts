import { useContext } from "react";
import provider from "common/utils/web3/createProvider";
import createVoidSignerVotingContractInstance from "web3/createVoidSignerVotingContractInstance";

import determineBlockchainNetwork from "web3/helpers/determineBlockchainNetwork";

import { useQuery } from "react-query";

import { queryRounds, Round } from "web3/get/queryRounds";
import { ErrorContext } from "common/context/ErrorContext";

const contract = createVoidSignerVotingContractInstance(
  provider,
  determineBlockchainNetwork()
);

// This can be accessed without logging the user in.
export default function useRound(roundId: number) {
  const { addError } = useContext(ErrorContext);

  const { data, error, isFetching, refetch } = useQuery<Round>(
    "round",
    () => {
      return queryRounds(contract, roundId)
        .then((res) => {
          if (res) {
            return res;
          } else {
            return {} as Round;
          }
        })
        .catch((err) => {
          addError(err);
          return {} as Round;
        });
    },
    {
      // Check if we've queried the right roundId
      enabled: roundId !== 0,
    }
  );

  if (data) {
    return { data, error, isFetching, refetch };
  } else {
    return { data: {} as Round, error, isFetching };
  }
}
