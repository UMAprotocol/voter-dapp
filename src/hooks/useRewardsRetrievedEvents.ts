import { useQuery } from "react-query";
import { ethers } from "ethers";
import {
  queryRewardsRetrieved,
  RewardsRetrieved,
} from "web3/get/queryRewardsRetrievedEvents";

export default function useRewardsRetrievedEvents(
  contract: ethers.Contract | null,
  address: string | null
) {
  const { data, error, isFetching } = useQuery<RewardsRetrieved[]>(
    "rewardsRetrievedEvents",
    () => {
      return queryRewardsRetrieved(contract, address).then((res) => {
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
    return { data: [] as RewardsRetrieved[], error, isFetching };
  }
}
