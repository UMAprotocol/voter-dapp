import { useQuery } from "react-query";
import { ethers } from "ethers";
import {
  queryVotesRevealedEvents,
  VoteRevealed,
} from "web3/get/queryVotesRevealedEvents";

export default function useVotesRevealedEvents(
  contract: ethers.Contract | null,
  address: string | null
) {
  const { data, error, isFetching, refetch } = useQuery<VoteRevealed[]>(
    "votesRevealedEvents",
    () => {
      return queryVotesRevealedEvents(contract, address).then((res) => {
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
    return { data, error, isFetching, refetch };
  } else {
    return { data: [] as VoteRevealed[], error, isFetching, refetch };
  }
}
