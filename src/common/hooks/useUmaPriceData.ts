import { useQuery } from "react-query";
import axios from "axios";
import { COIN_GECKO_UMA_TICKER_DATA } from "common/config";

interface LimitedCoinGeckoData {
  market_data: {
    current_price: {
      usd: number;
    };
  };
}
export default function useUmaPriceData() {
  const { isLoading, error, data } = useQuery<
    LimitedCoinGeckoData,
    "uma_price"
  >(
    "repoData",
    () => {
      return axios.get(COIN_GECKO_UMA_TICKER_DATA.url).then((res) => res.data);
    },
    {
      refetchInterval: 600000,
    }
  );

  return {
    data,
    isLoading,
    error,
  };
}
