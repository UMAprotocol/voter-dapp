import { useContext } from "react";
import provider from "common/utils/web3/createProvider";
import createVoidSignerVotingContractInstance from "common/web3/createVoidSignerVotingContractInstance";

import determineBlockchainNetwork from "common/web3/helpers/determineBlockchainNetwork";

import { useQuery } from "react-query";

import { queryRounds, Round } from "common/web3/get/queryRounds";
import { ErrorContext } from "common/context/ErrorContext";

const contract = createVoidSignerVotingContractInstance(
  provider,
  determineBlockchainNetwork()
);

// This can be accessed without logging the user in.
export default function useRound(roundId: number) {
  const { addError } = useContext(ErrorContext);

  const { data, error, isFetching, refetch } = useQuery<
    Round | undefined | void
  >(
    "round",
    () => {
      return queryRounds(contract, roundId)
        .then((res) => res)
        .catch((err) => addError(err));
    },
    {
      // Check if we've queried the right roundId
      enabled: roundId !== 0,
    }
  );

  return { data, error, isFetching, refetch };
}
