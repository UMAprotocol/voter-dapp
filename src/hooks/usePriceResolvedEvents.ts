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

  const { data, error, isFetching } = useQuery<
    PriceResolved[] | undefined | void
  >(
    "priceResolvedEvents",
    () => {
      return queryPriceResolved(contract)
        .then((res) => res)
        .catch((err) => addError(err));
    },
    { enabled: contract !== null }
  );

  return { data, error, isFetching };
}
