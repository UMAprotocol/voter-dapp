import { useContext } from "react";
import provider from "common/utils/web3/createProvider";
import createVoidSignerVotingContractInstance from "web3/createVoidSignerVotingContractInstance";
import determineBlockchainNetwork from "web3/helpers/determineBlockchainNetwork";
import { useQuery } from "react-query";

import { queryGetVotePhase } from "web3/get/queryGetVotePhase";

import { ErrorContext } from "common/context/ErrorContext";

const contract = createVoidSignerVotingContractInstance(
  provider,
  determineBlockchainNetwork()
);

// This can be accessed without logging the user in.
export default function useVotePhase() {
  const { addError } = useContext(ErrorContext);

  const { data, error, isFetching, refetch } = useQuery<
    string | undefined | void
  >("votePhase", () => {
    return queryGetVotePhase(contract)
      .then((res) => res)
      .catch((err) => addError(err));
  });

  return { data, error, isFetching, refetch };
}
