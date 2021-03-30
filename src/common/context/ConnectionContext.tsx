import { createContext, useEffect, useState, FC } from "react";
import { ethers } from "ethers";
import Onboard from "bnc-onboard";
import {OnboardWrapper, ConnectionState, DefaultState} from 'common/utils/createOnboardInstance'

export const EMPTY: unique symbol = Symbol();

type WithDelegatedProps = {
  [k: string]: unknown;
};

type TConnectionContext = [
  ConnectionState,
  any | null,
];

export const ConnectionContext = createContext<
  TConnectionContext | typeof EMPTY
>(EMPTY);
ConnectionContext.displayName = "ConnectionContext";


export const ConnectionProvider: FC<WithDelegatedProps> = ({
  children,
  ...delegated
}) => {
  const [state, setState] = useState<ConnectionState>(DefaultState)
  const [api, setApi] = useState<any>(null)

  useEffect(()=>{
    // we can imagine other providers with a similar API: combination of event emitter for state, and API calls
    setApi(OnboardWrapper(state,{ethers,Onboard},setState))
  },[])


  return (
    <ConnectionContext.Provider
      value={[state, api]}
      {...delegated}
    >
      {children}
    </ConnectionContext.Provider>
  );
};
