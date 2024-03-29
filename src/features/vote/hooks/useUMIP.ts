import { useQuery } from "react-query";
import { UMIP, fetchUmip } from "../helpers/fetchUMIP";

// only for testing purposes. This UMIP is returned to avoid showing misleading data on anything thats not mainnet.
const testUmip: UMIP = {
  description: `
    # Add UMA as collateral

    This is a fake UMIP only used for testing purposes. 
    If you can see this, it means you are currently connect to a testnet.
    If you wanted to vote on real proposals, please change network and refresh the page (and thank you for voting :))
  `,
  title: "Make UMA an oracle token",
  number: 100,
  umipLink: "https://umaproject.org",
};

const MAINNET_CHAIN_ID = 1;

export default function useUMIP(number?: number, chainId = 1) {
  const { data, ...others } = useQuery<UMIP>(
    ["umip", number],
    () => fetchUmip(number!),
    {
      enabled: number != null && chainId === 1,
      retry: 3,
    }
  );

  return { umip: chainId === MAINNET_CHAIN_ID ? data : testUmip, ...others };
}
