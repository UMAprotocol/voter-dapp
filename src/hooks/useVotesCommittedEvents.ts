import { useQuery } from "react-query";
import { ethers } from "ethers";
import { queryVotesCommittedEvents } from "web3/get/queryVotesCommittedEvents";
import { VoteEvent } from "web3/types.web3";

export default function useVotesCommittedEvents(
  contract: ethers.Contract | null,
  address: string | null
) {
  const { data, error, isFetching } = useQuery<VoteEvent[]>(
    "votesCommittedEvents",
    () => {
      return queryVotesCommittedEvents(contract, address).then((res) => {
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
    return { data: [] as VoteEvent[], error, isFetching };
  }
}
