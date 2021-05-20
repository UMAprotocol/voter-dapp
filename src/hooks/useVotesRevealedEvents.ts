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

  const { data, error, isFetching, refetch } = useQuery<VoteRevealed[]>(
    "votesRevealedEvents",
    () => {
      return queryVotesRevealedEvents(contract, address)
        .then((res) => {
          if (res) {
            return res;
          } else {
            return [];
          }
        })
        .catch((err) => {
          addError(err);
          return [] as VoteRevealed[];
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
