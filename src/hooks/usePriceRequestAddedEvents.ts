import { useQuery } from "react-query";
import {
  queryPriceRequestAdded,
  PriceRequestAdded,
} from "web3/queryVotingContractEvents";

import provider from "common/utils/web3/createProvider";
import createVoidSignerVotingContractInstance from "web3/createVoidSignerVotingContractInstance";
import determineBlockchainNetwork from "web3/helpers/determineBlockchainNetwork";

const contract = createVoidSignerVotingContractInstance(
  provider,
  determineBlockchainNetwork()
);

export default function usePriceRequestAddedEvents() {
  const { data, error, isFetching } = useQuery<PriceRequestAdded[]>(
    "priceRequestAdded",
    () => {
      return queryPriceRequestAdded(contract).then((res) => {
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
    return { data: [] as PriceRequestAdded[], error, isFetching };
  }
}
