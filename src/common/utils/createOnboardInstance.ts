import Onboard from "bnc-onboard";
import config from "common/config";
import { ethers } from "ethers";
import { Initialization, Subscriptions } from "bnc-onboard/dist/src/interfaces";
type Network = ethers.providers.Network;

// These are optional functions that can be injected into the Onboard instance that call when these values change.
// See docs for info (https://docs.blocknative.com/onboard#example-code);
// interface Initialization {
//   dappId?: string;
//   networkId: number;
//   networkName?: string;
//   subscriptions?: Subscriptions;
//   walletSelect?: WalletSelectModuleOptions;
//   walletCheck?: Array<WalletCheckModule | WalletCheckInit>;
//   darkMode?: boolean;
//   apiUrl?: string;
//   hideBranding?: boolean;
//   blockPollingInterval?: number;
// }

// Pass in some default options.
export default function createOnboardInstance(
  network: Network | null,
  subscriptions?: Subscriptions
) {
  const onboardConfig: Initialization = {
    dappId: config(network).onboardConfig.apiKey,
    hideBranding: true,
    networkId: 1, // Default to main net. If on a different network will change with the subscription.
    subscriptions,
    walletSelect: config(network).onboardConfig.onboardWalletSelect,
    walletCheck: config(network).onboardConfig.walletCheck,
  };

  return Onboard(onboardConfig);
}
