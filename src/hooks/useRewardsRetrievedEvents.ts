import { useContext } from "react";
import { useQuery } from "react-query";
import { ethers } from "ethers";
import {
  queryRewardsRetrieved,
  RewardsRetrieved,
} from "web3/get/queryRewardsRetrievedEvents";
import { ErrorContext } from "common/context/ErrorContext";

export default function useRewardsRetrievedEvents(
  contract: ethers.Contract | null,
  address: string | null
) {
  const { addError } = useContext(ErrorContext);

  const { data, error, isFetching } = useQuery<RewardsRetrieved[]>(
    "rewardsRetrievedEvents",
    () => {
      return queryRewardsRetrieved(contract, address)
        .then((res) => {
          if (res) {
            return res;
          } else {
            return [];
          }
        })
        .catch((err) => {
          addError(err.message);
          return [] as RewardsRetrieved[];
        });
    },
    { enabled: contract !== null && address !== null }
  );

  if (data) {
    return { data, error, isFetching };
  } else {
    return { data: [] as RewardsRetrieved[], error, isFetching };
  }
}
