import Onboard from "bnc-onboard";
import assert from 'assert'
import config from "common/config";
import { ethers } from "ethers";
import { Initialization, Subscriptions,  API as OnboardApi, Wallet } from "bnc-onboard/dist/src/interfaces";

// Other options that could be added to this instance, from docs.
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

// Subscriptions are optional functions that can be injected into the Onboard instance that call when these values change.
// See docs for info (https://docs.blocknative.com/onboard#example-code);

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

type Provider = ethers.providers.Web3Provider;
type Address = string;
type Network = ethers.providers.Network;
type Signer = ethers.Signer;
export type ConnectionState = {
  provider: Provider | null;
  onboard: OnboardApi | null;
  signer: Signer | null;
  network: Network | null;
  address: Address | null;
  error: Error | null;
  isConnected: boolean;
};
export const DefaultState: ConnectionState = {
  provider: null,
  onboard: null,
  signer: null,
  network: null,
  address: null,
  error: null,
  isConnected: false,
}

// This looks like it can execute in any environment, but the quirk about onboard is 
// it must be run in a browser afaik

// allows you to set initial state, pass in dependencies and emit events
export const OnboardWrapper = (state={...DefaultState},{Onboard,ethers}:any, emit:(state:any)=>void) => {
  let onboard:OnboardApi | null = null
  // helper to set state internally and emit out
  function set(obj={}){
    state = {...DefaultState,...state, ...obj}
    emit(state)
  }
  // gets state
  function get(){
    return state
  }
  // hard coded subscription callbacks
  const subscriptions = {
    address: (address: string | null) => {
      set({address})
    },
    network: async (networkId: any) => {
      onboard?.config({ networkId: networkId });
    },
    wallet: async (wallet: Wallet) => {
      if (wallet.provider) {
        // we should probably wrap this with ethers elsewhere
        const ethersProvider = new ethers.providers.Web3Provider(
          wallet.provider
        );
        set({
          provider:ethersProvider,
          signer:await ethersProvider.getSigner(),
          network:await ethersProvider.getNetwork()
        })
      } else {
        set({
          provider:null,network:null,signer:null
        })
      }
    },
  };
  async function connect(network:Network){
    assert(!(state?.isConnected),'Already connected')
    onboard = Onboard({subscriptions,network})
    assert(onboard,'Onboard instance null')
    await onboard.walletSelect();
    await onboard.walletCheck();
    set({onboard,isConnected:true})
  }
  function disconnect(){
    assert(state?.isConnected,'Already disconnected')
    onboard?.walletReset();
    set(DefaultState)
  }
  // fill in default state on init and emit event
  set(state)

  // return api interface
  return {
    connect,disconnect,set,get
  }
}
