import { createContext, useReducer } from "react";
import { ethers } from "ethers";
import { API as OnboardApi } from "bnc-onboard/dist/src/interfaces";

type Provider = ethers.providers.Web3Provider;
type Address = string;
type Network = ethers.providers.Network;
type Signer = ethers.Signer;

type ConnectionState = {
  provider: Provider | null;
  onboard: OnboardApi | null;
  signer: Signer | null;
  network: Network | null;
  address: Address | null;
  error: Error | null;
  isConnected: boolean;
};

type Action =
  | {
      type: "set provider";
      provider: Provider | null;
    }
  | {
      type: "set onboard";
      onboard: OnboardApi | null;
    }
  | {
      type: "set signer";
      signer: Signer | null;
    }
  | {
      type: "set network";
      network: Network | null;
    }
  | {
      type: "set address";
      address: Address | null;
    }
  | {
      type: "set error";
      error: Error | null;
    }
  | {
      type: "set connection status";
      isConnected: boolean;
    };

type ConnectionDispatch = React.Dispatch<Action>;
type TConnectionContext = [ConnectionState, ConnectionDispatch];

type WithDelegatedProps = {
  [k: string]: unknown;
};

export const EMPTY: unique symbol = Symbol();

export const ConnectionContext = createContext<
  TConnectionContext | typeof EMPTY
>(EMPTY);
ConnectionContext.displayName = "ConnectionContext";

function connectionReducer(state: ConnectionState, action: Action) {
  switch (action.type) {
    case "set provider": {
      return {
        ...state,
        provider: action.provider,
      };
    }
    case "set onboard": {
      return {
        ...state,
        onboard: action.onboard,
      };
    }
    case "set signer": {
      return {
        ...state,
        signer: action.signer,
      };
    }
    case "set network": {
      return {
        ...state,
        network: action.network,
      };
    }
    case "set address": {
      return {
        ...state,
        address: action.address,
      };
    }
    case "set error": {
      return {
        ...state,
        error: action.error,
      };
    }
    case "set connection status": {
      return {
        ...state,
        isConnected: action.isConnected,
      };
    }
    default: {
      throw new Error(`Unsopported action type ${(action as any).type}`);
    }
  }
}
export const ConnectionProvider: React.FC<WithDelegatedProps> = ({
  children,
  ...delegated
}) => {
  const [connection, dispatch] = useReducer(connectionReducer, {
    provider: null,
    onboard: null,
    signer: null,
    network: null,
    address: null,
    error: null,
    isConnected: false,
  });

  return (
    <ConnectionContext.Provider value={[connection, dispatch]} {...delegated}>
      {children}
    </ConnectionContext.Provider>
  );
};
