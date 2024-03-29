import { useQuery } from "react-query";
import { ethers } from "ethers";
import {
  queryVotesRevealedEvents,
  VoteRevealed,
} from "common/web3/get/queryVotesRevealedEvents";

export default function useVotesRevealedEvents(
  contract: ethers.Contract | null,
  address: string | null
) {
  return useQuery<VoteRevealed[] | undefined | void>(
    ["votesRevealedEvents", address],
    () => queryVotesRevealedEvents(contract, address),
    { enabled: !!contract && !!address }
  );
}
