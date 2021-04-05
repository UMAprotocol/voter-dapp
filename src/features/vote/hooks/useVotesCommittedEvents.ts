import { useQuery } from "react-query";
import { ethers } from "ethers";
import { queryVotesCommitted, VoteEvent } from "web3/queryVotingContractEvents";

export default function useVotesCommittedEvents(
  contract: ethers.Contract | null,
  address: string | null
) {
  const { data } = useQuery<VoteEvent[] | Error>("votesCommittedEvents", () => {
    return queryVotesCommitted(contract, address).then((res) => {
      if (res) {
        return res;
      } else {
        return [];
      }
    });
  });

  if (data instanceof Error) return [] as VoteEvent[];

  if (data) {
    return [data];
  } else {
    return [[] as VoteEvent[]];
  }
}
