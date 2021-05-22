import { useContext } from "react";
import { useQuery } from "react-query";
import { ethers } from "ethers";
import {
  queryVotesRevealedEvents,
  VoteRevealed,
} from "web3/get/queryVotesRevealedEvents";
import { ErrorContext } from "common/context/ErrorContext";

export default function useVotesRevealedEvents(
  contract: ethers.Contract | null,
  address: string | null
) {
  const { addError } = useContext(ErrorContext);

  const { data, error, isFetching, refetch } = useQuery<
    VoteRevealed[] | undefined | void
  >(
    "votesRevealedEvents",
    () => {
      return queryVotesRevealedEvents(contract, address)
        .then((res) => res)
        .catch((err) => addError(err));
    },
    { enabled: contract !== null }
  );

  return { data, error, isFetching, refetch };
}
