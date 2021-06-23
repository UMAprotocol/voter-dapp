import { useContext } from "react";
import { useQuery } from "react-query";
import {
  queryVotesRevealedEvents,
  VoteRevealed,
} from "web3/get/queryVotesRevealedEvents";
import { ErrorContext } from "common/context/ErrorContext";
import provider from "common/utils/web3/createProvider";
import createVoidSignerVotingContractInstance from "web3/createVoidSignerVotingContractInstance";
import determineBlockchainNetwork from "web3/helpers/determineBlockchainNetwork";

const contract = createVoidSignerVotingContractInstance(
  provider,
  determineBlockchainNetwork()
);

export default function useVotesRevealedEventsSummary() {
  const { addError } = useContext(ErrorContext);

  const { data, error, isFetching, refetch } = useQuery<
    VoteRevealed[] | undefined | void
  >(
    "votesRevealedEventsSummary",
    () => {
      return queryVotesRevealedEvents(contract, null)
        .then((res) => res)
        .catch((err) => addError(err));
    },
    { enabled: contract !== null }
  );

  return { data, error, isFetching, refetch };
}
