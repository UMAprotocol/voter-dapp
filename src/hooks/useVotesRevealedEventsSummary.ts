import { useQuery } from "react-query";
import {
  queryVotesRevealedEvents,
  VoteRevealed,
} from "common/web3/get/queryVotesRevealedEvents";
import provider from "common/utils/web3/createProvider";
import createVoidSignerVotingContractInstance from "common/web3/createVoidSignerVotingContractInstance";
import determineBlockchainNetwork from "common/web3/helpers/determineBlockchainNetwork";

const contract = createVoidSignerVotingContractInstance(
  provider,
  determineBlockchainNetwork()
);

export default function useVotesRevealedEventsSummary() {
  return useQuery<VoteRevealed[] | undefined | void>(
    "votesRevealedEventsSummary",
    () => queryVotesRevealedEvents(contract),
    { enabled: contract !== null }
  );
}
