import { useContext } from "react";
import { useQuery } from "react-query";
import { ethers } from "ethers";
import {
  queryRewardsRetrievedEvents,
  RewardsRetrieved,
} from "web3/get/queryRewardsRetrievedEvents";
import { ErrorContext } from "common/context/ErrorContext";

export default function useRewardsRetrievedEvents(
  contract: ethers.Contract | null,
  address: string | null
) {
  const { addError } = useContext(ErrorContext);

  const { data, error, isFetching } = useQuery<
    RewardsRetrieved[] | undefined | void
  >(
    "rewardsRetrievedEvents",
    () => {
      return queryRewardsRetrievedEvents(contract, address)
        .then((res) => res)
        .catch((err) => addError(err));
    },
    { enabled: contract !== null && address !== null }
  );

  return { data, error, isFetching };
}
