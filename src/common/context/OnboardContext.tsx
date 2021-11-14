import { createContext, useReducer, Dispatch, FC, useEffect } from "react";
import { ethers } from "ethers";
import { API as OnboardApi, Wallet} from "bnc-onboard/dist/src/interfaces";
import createOnboardInstance from "common/utils/web3/createOnboardInstance";
import Notify, { API as NotifyAPI } from "bnc-notify";
import Events from 'events'

type Provider = ethers.providers.Web3Provider;
type Address = string;
type Network = ethers.providers.Network;
type Signer = ethers.Signer;

type OnboardState = {
  provider: Provider | null;
  onboard: OnboardApi;
  signer: Signer | null;
  network: Network | null;
  address: Address | null;
  error: Error | null;
  isConnected: boolean;
  notify: NotifyAPI | null;
};

type ChainId = 1 | 42 | 1337;

const getNetworkName = (chainId: ChainId) => {
  switch (chainId) {
    case 1: {
      return "homestead";
    }
    case 42: {
      return "kovan";
    }
    case 1337: {
      return "test";
    }
  }
};

const SET_PROVIDER = "SET_PROVIDER";
const SET_SIGNER = "SET_SIGNER";
const SET_NETWORK = "SET_NETWORK";
const SET_ADDRESS = "SET_ADDRESS";
const SET_ERROR = "SET_ERROR";
const SET_CONNECTION_STATUS = "SET_CONNECTION_STATUS";
const RESET_STATE = "RESET_STATE";
const SET_NOTIFY = "SET_NOTIFY";

export const actions = {
  SET_PROVIDER: SET_PROVIDER as typeof SET_PROVIDER,
  SET_SIGNER: SET_SIGNER as typeof SET_SIGNER,
  SET_NETWORK: SET_NETWORK as typeof SET_NETWORK,
  SET_ADDRESS: SET_ADDRESS as typeof SET_ADDRESS,
  SET_ERROR: SET_ERROR as typeof SET_ERROR,
  SET_CONNECTION_STATUS: SET_CONNECTION_STATUS as typeof SET_CONNECTION_STATUS,
  RESET_STATE: RESET_STATE as typeof RESET_STATE,
  SET_NOTIFY: SET_NOTIFY as typeof SET_NOTIFY,
};

type Action =
  | {
      type: `${typeof SET_PROVIDER}`;
      payload: Provider | null;
    }
  | {
      type: typeof SET_SIGNER;
      payload: Signer | null;
    }
  | {
      type: typeof SET_NETWORK;
      payload: Network | null;
    }
  | {
      type: typeof SET_ADDRESS;
      payload: Address | null;
    }
  | {
      type: typeof SET_ERROR;
      payload: Error | null;
    }
  | {
      type: typeof SET_CONNECTION_STATUS;
      payload: boolean;
    }
  | { type: typeof RESET_STATE }
  | { type: typeof SET_NOTIFY; payload: NotifyAPI | null };

export type OnboardDispatch = Dispatch<Action>;

type WithDelegatedProps = {
  [k: string]: unknown;
};

const events = new Events()
const subscriptions = {
  address: (addr: string | null) => {
    events.emit('event','address',addr)
  },
  network: async (networkId: any) => {
    events.emit('event','network',networkId)
  },
  wallet: async (wallet: Wallet) => {
    events.emit('event','wallet',wallet)
  },
};
const onboardInstance = createOnboardInstance(1 as any, subscriptions);

function connectionReducer(state: OnboardState, action: Action) {
  switch (action.type) {
    case SET_PROVIDER: {
      return {
        ...state,
        provider: action.payload,
      };
    }
    case SET_SIGNER: {
      return {
        ...state,
        signer: action.payload,
      };
    }
    case SET_NETWORK: {
      return {
        ...state,
        network: action.payload,
      };
    }
    case SET_ADDRESS: {
      return {
        ...state,
        address: action.payload,
      };
    }
    case SET_ERROR: {
      return {
        ...state,
        error: action.payload,
      };
    }
    case SET_CONNECTION_STATUS: {
      return {
        ...state,
        isConnected: action.payload,
      };
    }
    case SET_NOTIFY: {
      return {
        ...state,
        notify: action.payload,
      };
    }
    case RESET_STATE: {
      return { ...INITIAL_STATE, onboard: state.onboard };
    }
    default: {
      throw new Error(`Unsupported action type ${(action as any).type}`);
    }
  }
}

const INITIAL_STATE = {
  provider: null,
  onboard: onboardInstance,
  signer: null,
  network: null,
  address: null,
  error: null,
  isConnected: false,
  notify: null,
};

const connect = async (
  dispatch: OnboardDispatch,
  onboard: OnboardApi
) => {
  try {

    await onboard.walletSelect();
    await onboard.walletCheck();

    dispatch({ type: actions.SET_CONNECTION_STATUS, payload: true });
  } catch (error) {
    dispatch({ type: actions.SET_ERROR, payload: error });
  }
};

const disconnect = (dispatch: OnboardDispatch, onboard: OnboardApi) => {
  onboard.walletReset();
  dispatch({ type: actions.RESET_STATE });
};

export type Connect = typeof connect;
export type Disconnect = typeof disconnect;

export interface TOnboardContext {
  state: OnboardState;
  dispatch: OnboardDispatch;
  connect: typeof connect;
  disconnect: typeof disconnect;
}

export const OnboardContext = createContext<TOnboardContext>(
  {} as TOnboardContext
);

OnboardContext.displayName = "OnboardContext";

const OnboardProvider: FC<WithDelegatedProps> = ({
  children,
  ...delegated
}) => {
  const [state, dispatch] = useReducer(connectionReducer, INITIAL_STATE);

  useEffect(()=>{
    events.on('event',(event:string,data:any)=>{
      switch(event){
        case 'wallet':{
          const wallet:Wallet = data
          if (wallet.provider) {
            const ethersProvider = new ethers.providers.Web3Provider(
              wallet.provider
            );
            dispatch({ type: actions.SET_PROVIDER, payload: ethersProvider });
            dispatch({
              type: actions.SET_SIGNER,
              payload: ethersProvider.getSigner(),
            });
            // dispatch({
            //   type: actions.SET_NETWORK,
            //   payload: await ethersProvider.getNetwork(),
            // });
          } else {
            dispatch({ type: actions.SET_PROVIDER, payload: null });
            dispatch({ type: actions.SET_NETWORK, payload: null });
          }
          break;
        }
        case 'network':{
          const networkId = data 
          if (networkId) {
            dispatch({
              type: actions.SET_NETWORK,
              payload: {
                chainId: networkId,
                name: getNetworkName(networkId as ChainId),
              },
            });
          } else {
            dispatch({
              type: actions.SET_NETWORK,
              payload: null,
            });
          }

          // Notify.js doesn't work on ganache anyway (see: docs).
          // So don't bother initializing it on test.
          if (process.env.REACT_APP_CURRENT_ENV !== "test") {
            if (networkId) {
              dispatch({
                type: actions.SET_NOTIFY,
                payload: Notify({
                  dappId: process.env.REACT_APP_PUBLIC_ONBOARD_API_KEY, // [String] The API key created by step one above
                  networkId, // [Integer] The Ethereum network ID your Dapp uses.
                  desktopPosition: "topRight",
                }),
              });
            } else {
              dispatch({
                type: actions.SET_NOTIFY,
                payload: null,
              });
            }
          }
          break;
        }
        case 'address':{
          const addr: string | null = data
          dispatch({ type: actions.SET_ADDRESS, payload: addr });
          break;
        }
      }
    })
    return ()=>{
      events.removeAllListeners('events')
    }
  },[dispatch])


  return (
    <OnboardContext.Provider
      value={{ state, dispatch, connect, disconnect }}
      {...delegated}
    >
      {children}
    </OnboardContext.Provider>
  );
};

export default OnboardProvider;
