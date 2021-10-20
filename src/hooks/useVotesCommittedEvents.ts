import { useContext } from "react";
import { useQuery } from "react-query";
import { queryVotesCommittedEvents } from "common/web3/get/queryVotesCommittedEvents";
import { VoteEvent } from "common/web3/types.web3";
import { ErrorContext } from "common/context/ErrorContext";
import provider from "common/utils/web3/createProvider";
import createVoidSignerVotingContractInstance from "common/web3/createVoidSignerVotingContractInstance";
import determineBlockchainNetwork from "common/web3/helpers/determineBlockchainNetwork";

const contract = createVoidSignerVotingContractInstance(
  provider,
  determineBlockchainNetwork()
);

export default function useVotesCommittedEvents(address: string | null) {
  const { addError } = useContext(ErrorContext);

  const { data, error, isFetching } = useQuery<VoteEvent[] | undefined | void>(
    "votesCommittedEvents",
    () => {
      return queryVotesCommittedEvents(contract, address)
        .then((res) => res)
        .catch((err) => addError(err));
    },
    { enabled: contract !== null }
  );

  return { data, error, isFetching };
}
