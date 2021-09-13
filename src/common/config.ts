import { ethers } from "ethers";
import {
  WalletModule,
  WalletInitOptions,
} from "bnc-onboard/dist/src/interfaces";

type Network = ethers.providers.Network;

export const infuraId = process.env.REACT_APP_PUBLIC_INFURA_ID || "";
export const SUPPORTED_NETWORK_IDS = [1, 42, 1337] as const;

const MAINNET_DEPLOY_BLOCK = 11876839;
const KOVAN_BLOCK = 23649096;
const LOCAL_BLOCK = 0;

// Determine block based on current test environemnt
// Defaults to Mainnet.
export const VOTER_CONTRACT_BLOCK =
  process.env.REACT_APP_CURRENT_ENV === "main"
    ? MAINNET_DEPLOY_BLOCK
    : process.env.REACT_APP_CURRENT_ENV === "test"
    ? LOCAL_BLOCK
    : process.env.REACT_APP_CURRENT_ENV === "kovan"
    ? KOVAN_BLOCK
    : MAINNET_DEPLOY_BLOCK;

export const COIN_GECKO_UMA_TICKER_DATA = {
  id: "uma",
  symbol: "uma",
  name: "UMA",
  url: "https://api.coingecko.com/api/v3/coins/uma",
};

// We need these for rewards.
export const OLD_VOTING_CONTRACT_ADDRESSES = [
  "0xFe3C4F1ec9f5df918D42Ef7Ed3fBA81CC0086c5F",
  "0x9921810C710E7c3f7A7C6831e30929f19537a545",
  "0x1d847fb6e04437151736a53f09b6e49713a52aad",
];

const customExtensionWalletLogo = `
	<svg 
		height="40" 
		viewBox="0 0 40 40" 
		width="40" 
		xmlns="http://www.w3.org/2000/svg"
	>
		<path 
			d="m2744.99995 1155h9.99997" 
			fill="#617bff" 
		/>
	</svg>
`;

const CYPRESS_TESTING_WALLET = {
  name: "Cypress Testing Wallet",
  svg: customExtensionWalletLogo,
  wallet: async (helpers: any) => {
    const { createModernProviderInterface } = helpers;
    if ((window as any).ethereum) {
      const w = window as any;
      const provider = w.ethereum;
      const correctWallet = w.ethereum.currentProvider.isExtensionWallet;
      return {
        provider,
        interface: correctWallet
          ? createModernProviderInterface(provider)
          : null,
      };
    }
  },
  // link: 'https://some-extension-wallet.io',
  // installMessage: wallets => {
  // 	const { currentWallet, selectedWallet } = wallets
  // 	if (currentWallet) {
  // 		return `You have ${currentWallet} installed already but if you would prefer to use ${selectedWallet} instead, then click below to install.`
  // 	}

  // 	return `You will need to install ${selectedWallet} to continue. Click below to install.`
  // },
  desktop: true,
} as WalletModule;

const wallets = [{ walletName: "metamask", preferred: true }] as (
  | WalletModule
  | WalletInitOptions
)[];

if (localStorage.getItem("cypress-testing")) {
  wallets.push(CYPRESS_TESTING_WALLET);
}

export default function config(network: Network | null) {
  // const infuraRpc = `https://${
  //   network ? network?.name : "mainnet"
  // }.infura.io/v3/${infuraId}`;

  return {
    onboardConfig: {
      apiKey: process.env.REACT_APP_PUBLIC_ONBOARD_API_KEY || "",
      onboardWalletSelect: {
        wallets: wallets,
        // CYPRESS_TESTING_WALLET,
        // {
        //   walletName: "imToken",
        //   rpcUrl:
        //     !!network && network.chainId === 1
        //       ? "https://mainnet-eth.token.im"
        //       : "https://eth-testnet.tokenlon.im",
        //   preferred: true,
        // },
        // { walletName: "coinbase", preferred: true },
        // {
        //   walletName: "portis",
        //   apiKey: process.env.REACT_APP_PUBLIC_PORTIS_API_KEY,
        // },
        // { walletName: "trust", rpcUrl: infuraRpc },
        // { walletName: "dapper" },
        // {
        //   walletName: "walletConnect",
        //   rpc: { [network?.chainId || 1]: infuraRpc },
        // },
        // { walletName: "walletLink", rpcUrl: infuraRpc },
        // { walletName: "opera" },
        // { walletName: "operaTouch" },
        // { walletName: "torus" },
        // { walletName: "status" },
        // { walletName: "unilogin" },
        // {
        //   walletName: "ledger",
        //   rpcUrl: infuraRpc,
        // },
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

// WIP -- create config using a Map.
const MAINNET_NETWORK_ID = 1;
const KOVAN_NETWORK_ID = 42;
const TESTNET_NETWORK_ID = 1337;
interface ConfigObject {
  deployBlock: number;
  subgraphUrl: string;
}

export const Config = new Map<number, ConfigObject>([
  [
    MAINNET_NETWORK_ID,
    {
      deployBlock: MAINNET_DEPLOY_BLOCK,
      subgraphUrl:
        "https://api.thegraph.com/subgraphs/name/umaprotocol/mainnet-voting",
    },
  ],
  [
    KOVAN_NETWORK_ID,
    {
      deployBlock: KOVAN_BLOCK,
      subgraphUrl: "",
    },
  ],
  [
    TESTNET_NETWORK_ID,
    {
      deployBlock: 0,
      subgraphUrl: "",
    },
  ],
]);

// Kept for testing. This will throw an error if you try to convert the hexstring to UTF8.
export const TEST_BAD_UTF8 =
  "0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001d526574726965766520666f7220766f7465732073616d6520726f756e64000000";

// const isNetworkSupported = Config.has(networkid)

// // We can get our network config:
// const config = Config.get(networkid)
