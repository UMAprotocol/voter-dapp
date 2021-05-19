import { useContext } from "react";

import { useQuery } from "react-query";
import { ethers } from "ethers";
import {
  queryPriceResolved,
  PriceResolved,
} from "web3/get/queryPriceResolvedEvents";
import { ErrorContext } from "common/context/ErrorContext";

export default function usePriceResolvedEvents(
  contract: ethers.Contract | null
) {
  const { addError } = useContext(ErrorContext);

  const { data, error, isFetching } = useQuery<PriceResolved[]>(
    "priceResolvedEvents",
    () => {
      return queryPriceResolved(contract)
        .then((res) => {
          if (res) {
            return res;
          } else {
            return [];
          }
        })
        .catch((err) => {
          addError(err.message);
          return [] as PriceResolved[];
        });
    },
    { enabled: contract !== null }
  );

  if (data) {
    return { data, error, isFetching };
  } else {
    return { data: [] as PriceResolved[], error, isFetching };
  }
}
