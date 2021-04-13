import { ethers } from "ethers";
type Network = ethers.providers.Network;

export const infuraId = process.env.REACT_APP_PUBLIC_INFURA_ID || "";
export const SUPPORTED_NETWORK_IDS = [1, 42, 1337] as const;

const MAINNET_DEPLOY_BLOCK = 11876839;
// Determine block based on current test environemnt
// Defaults to Mainnet.
export let VOTER_CONTRACT_BLOCK =
  process.env.REACT_APP_CURRENT_ENV === "main"
    ? MAINNET_DEPLOY_BLOCK
    : process.env.REACT_APP_CURRENT_ENV === "test"
    ? 0
    : process.env.REACT_APP_CURRENT_ENV === "kovan"
    ? 0
    : MAINNET_DEPLOY_BLOCK;

export const COIN_GECKO_UMA_TICKER_DATA = {
  id: "uma",
  symbol: "uma",
  name: "UMA",
  url: "https://api.coingecko.com/api/v3/coins/uma",
};

export default function config(network: Network | null) {
  const infuraRpc = `https://${
    network ? network?.name : "mainnet"
  }.infura.io/v3/${infuraId}`;

  return {
    onboardConfig: {
      apiKey: process.env.REACT_APP_PUBLIC_ONBOARD_API_KEY || "",
      onboardWalletSelect: {
        wallets: [
          { walletName: "metamask", preferred: true },
          {
            walletName: "imToken",
            rpcUrl:
              !!network && network.chainId === 1
                ? "https://mainnet-eth.token.im"
                : "https://eth-testnet.tokenlon.im",
            preferred: true,
          },
          { walletName: "coinbase", preferred: true },
          {
            walletName: "portis",
            apiKey: process.env.REACT_APP_PUBLIC_PORTIS_API_KEY,
          },
          { walletName: "trust", rpcUrl: infuraRpc },
          { walletName: "dapper" },
          {
            walletName: "walletConnect",
            rpc: { [network?.chainId || 1]: infuraRpc },
          },
          { walletName: "walletLink", rpcUrl: infuraRpc },
          { walletName: "opera" },
          { walletName: "operaTouch" },
          { walletName: "torus" },
          { walletName: "status" },
          { walletName: "unilogin" },
          {
            walletName: "ledger",
            rpcUrl: infuraRpc,
          },
        ],
      },
      walletCheck: [
        { checkName: "connect" },
        { checkName: "accounts" },
        { checkName: "network" },
        { checkName: "balance", minimumBalance: "0" },
      ],
    },
  };
}
