import { createContext, useReducer, Dispatch, FC } from "react";
import { ethers } from "ethers";
import { API as OnboardApi } from "bnc-onboard/dist/src/interfaces";
import createOnboardInstance from "common/utils/createOnboardInstance";
import { Subscriptions } from "bnc-onboard/dist/src/interfaces";

type Provider = ethers.providers.Web3Provider;
type Address = string;
type Network = ethers.providers.Network;
type Signer = ethers.Signer;

type OnboardState = {
  provider: Provider | null;
  onboard: OnboardApi | null;
  signer: Signer | null;
  network: Network | null;
  address: Address | null;
  error: Error | null;
  isConnected: boolean;
};

const SET_PROVIDER = "SET_PROVIDER";
const SET_ONBOARD = "SET_ONBOARD";
const SET_SIGNER = "SET_SIGNER";
const SET_NETWORK = "SET_NETWORK";
const SET_ADDRESS = "SET_ADDRESS";
const SET_ERROR = "SET_ERROR";
const SET_CONNECTION_STATUS = "SET_CONNECTION_STATUS";
const RESET_STATE = "RESET_STATE";

export const actions = {
  SET_PROVIDER: SET_PROVIDER as typeof SET_PROVIDER,
  SET_ONBOARD: SET_ONBOARD as typeof SET_ONBOARD,
  SET_SIGNER: SET_SIGNER as typeof SET_SIGNER,
  SET_NETWORK: SET_NETWORK as typeof SET_NETWORK,
  SET_ADDRESS: SET_ADDRESS as typeof SET_ADDRESS,
  SET_ERROR: SET_ERROR as typeof SET_ERROR,
  SET_CONNECTION_STATUS: SET_CONNECTION_STATUS as typeof SET_CONNECTION_STATUS,
  RESET_STATE: RESET_STATE as typeof RESET_STATE,
};

type Action =
  | {
      type: `${typeof SET_PROVIDER}`;
      payload: Provider | null;
    }
  | {
      type: typeof SET_ONBOARD;
      payload: OnboardApi | null;
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
  | { type: typeof RESET_STATE };

export type OnboardDispatch = Dispatch<Action>;

type WithDelegatedProps = {
  [k: string]: unknown;
};
function connectionReducer(state: OnboardState, action: Action) {
  switch (action.type) {
    case SET_PROVIDER: {
      return {
        ...state,
        provider: action.payload,
      };
    }
    case SET_ONBOARD: {
      return {
        ...state,
        onboard: action.payload,
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
    case RESET_STATE: {
      return INITIAL_STATE;
    }
    default: {
      throw new Error(`Unsupported action type ${(action as any).type}`);
    }
  }
}

const INITIAL_STATE = {
  provider: null,
  onboard: null,
  signer: null,
  network: null,
  address: null,
  error: null,
  isConnected: false,
};

const connect = async (
  dispatch: OnboardDispatch,
  network: Network | null,
  subscriptions: Subscriptions
) => {
  try {
    const onboardInstance = createOnboardInstance(network, subscriptions);

    await onboardInstance.walletSelect();
    await onboardInstance.walletCheck();

    dispatch({ type: actions.SET_ONBOARD, payload: onboardInstance });
    dispatch({ type: actions.SET_CONNECTION_STATUS, payload: true });
  } catch (error) {
    dispatch({ type: actions.SET_ERROR, payload: error });
  }
};

const disconnect = (dispatch: OnboardDispatch, onboard: OnboardApi | null) => {
  onboard?.walletReset();
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
