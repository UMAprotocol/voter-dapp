import { useQuery } from "react-query";
import { ethers } from "ethers";
import {
  queryPriceResolved,
  PriceResolved,
} from "web3/queryVotingContractEvents";

export default function usePriceResolvedEvents(
  contract: ethers.Contract | null
) {
  const { data } = useQuery<PriceResolved[] | Error>(
    "priceResolvedEvents",
    () => {
      return queryPriceResolved(contract).then((res) => {
        if (res instanceof Error) return [];
        if (res) {
          return res;
        } else {
          return [];
        }
      });
    }
  );

  if (data instanceof Error) return [] as PriceResolved[];

  if (data) {
    return [data];
  } else {
    return [[] as PriceResolved[]];
  }
}
