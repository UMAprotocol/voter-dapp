import provider from "common/utils/web3/createProvider";
import createVoidSignerVotingContractInstance from "web3/createVoidSignerVotingContractInstance";
import determineBlockchainNetwork from "web3/helpers/determineBlockchainNetwork";
import { useQuery } from "react-query";

import { queryGetVotePhase } from "web3/queryVotingContractMethods";

const contract = createVoidSignerVotingContractInstance(
  provider,
  determineBlockchainNetwork()
);

// This can be accessed without logging the user in.
export default function useVotePhase() {
  const { data, error, isFetching, refetch } = useQuery<string>(
    "votePhase",
    () => {
      return queryGetVotePhase(contract).then((res) => {
        if (res) {
          return res;
        } else {
          return "";
        }
      });
    }
  );

  if (data) {
    return { data, error, isFetching, refetch };
  } else {
    return { data: "", error, isFetching };
  }
}