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
  const { data } = useQuery<VoteRevealed[] | Error>(
    "votesCommittedEvents",
    () => {
      return queryVoteRevealed(contract, address).then((res) => {
        if (res) {
          return res;
        } else {
          return [];
        }
      });
    }
  );

  if (data instanceof Error) return [] as VoteRevealed[];

  if (data) {
    return [data];
  } else {
    return [[] as VoteRevealed[]];
  }
}
