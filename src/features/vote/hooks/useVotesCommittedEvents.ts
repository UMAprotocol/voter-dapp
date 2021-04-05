import { useQuery } from "react-query";
import { ethers } from "ethers";
import { queryVotesCommitted, VoteEvent } from "web3/queryVotingContractEvents";

export default function useVotesCommittedEvents(
  contract: ethers.Contract | null,
  address: string | null
) {
  const { data, error, isFetching } = useQuery<VoteEvent[]>(
    "votesCommittedEvents",
    () => {
      return queryVotesCommitted(contract, address).then((res) => {
        if (res) {
          return res;
        } else {
          return [];
        }
      });
    },
    { enabled: contract !== null ? true : false }
  );

  if (data) {
    return { data, error, isFetching };
  } else {
    return { data: [] as VoteEvent[], error, isFetching };
  }
}
