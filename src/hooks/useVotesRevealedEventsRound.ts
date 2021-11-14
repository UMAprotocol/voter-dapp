import { useQuery } from "react-query";
import { ethers } from "ethers";
import {
  queryVotesRevealedEvents,
  VoteRevealed,
} from "common/web3/get/queryVotesRevealedEvents";

export default function useVotesRevealedEvents(
  contract: ethers.Contract | null,
  address: string | null,
  roundId?: string
) {
  return useQuery<VoteRevealed[] | undefined | void>(
    ["votesRevealedEventsByRound", address, roundId],
    () => queryVotesRevealedEvents(contract, address, roundId),
    { enabled: !!contract && !!roundId && !!roundId.length && !!address }
  );
}
