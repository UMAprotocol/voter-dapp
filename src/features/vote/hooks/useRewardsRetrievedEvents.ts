import { useQuery } from "react-query";
import { ethers } from "ethers";
import {
  queryRewardsRetrieved,
  RewardsRetrieved,
} from "web3/queryVotingContractEvents";

export default function useRewardsRetrievedEvents(
  contract: ethers.Contract | null,
  address: string | null
) {
  const { data } = useQuery<RewardsRetrieved[] | Error>(
    "rewardsRetrievedEvents",
    () => {
      return queryRewardsRetrieved(contract, address).then((res) => {
        if (res instanceof Error) return [];

        if (res) {
          return res;
        } else {
          return [];
        }
      });
    }
  );
  if (data instanceof Error) return [] as RewardsRetrieved[];

  if (data) {
    return [data];
  } else {
    return [[] as RewardsRetrieved[]];
  }
}
