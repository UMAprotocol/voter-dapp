import { useContext } from "react";
import { useQuery } from "react-query";
import { ethers } from "ethers";
import { queryVotesCommittedEvents } from "web3/get/queryVotesCommittedEvents";
import { VoteEvent } from "web3/types.web3";
import { ErrorContext } from "common/context/ErrorContext";

export default function useVotesCommittedEvents(
  contract: ethers.Contract | null,
  address: string | null
) {
  const { addError } = useContext(ErrorContext);

  const { data, error, isFetching } = useQuery<VoteEvent[] | undefined | void>(
    "votesCommittedEvents",
    () => {
      return queryVotesCommittedEvents(contract, address)
        .then((res) => res)
        .catch((err) => addError(err));
    },
    { enabled: contract !== null }
  );

  return { data, error, isFetching };
}
