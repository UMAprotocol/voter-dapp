import { useQuery } from "react-query";
import { ethers } from "ethers";
import {
  queryVoteRevealed,
  VoteRevealed,
} from "web3/queryVotingContractEvents";

export default function useVotesRevealedEvents(
  contract: ethers.Contract | null,
  address: string | null
) {
  const { data, error, isFetching } = useQuery<VoteRevealed[]>(
    "votesRevealedEvents",
    () => {
      return queryVoteRevealed(contract, address).then((res) => {
        if (res) {
          return res;
        } else {
          return [];
        }
      });
    },
    { enabled: contract !== null }
  );

  if (data) {
    return { data, error, isFetching };
  } else {
    return { data: [] as VoteRevealed[], error, isFetching };
  }
}
