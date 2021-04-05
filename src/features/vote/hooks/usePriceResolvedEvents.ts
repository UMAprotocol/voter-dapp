import { useQuery } from "react-query";
import { ethers } from "ethers";
import {
  queryPriceResolved,
  PriceResolved,
} from "web3/queryVotingContractEvents";

export default function usePriceResolvedEvents(
  contract: ethers.Contract | null
) {
  const { data, error, isFetching } = useQuery<PriceResolved[]>(
    "priceResolvedEvents",
    () => {
      return queryPriceResolved(contract).then((res) => {
        if (res) {
          return res;
        } else {
          return [];
        }
      });
    },
    { enabled: contract !== null ? true : false }
  );

  if (data) {
    return { data, error, isFetching };
  } else {
    return { data: [] as PriceResolved[], error, isFetching };
  }
}
