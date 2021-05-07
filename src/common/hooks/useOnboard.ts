import { useContext, useEffect, useState, useRef } from "react";
import { OnboardContext, actions } from "common/context/OnboardContext";
import { ethers } from "ethers";
import { Wallet } from "bnc-onboard/dist/src/interfaces";
import { SUPPORTED_NETWORK_IDS } from "common/config";

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

export default function useOnboard() {
  const [initOnboard, setInitOnboard] = useState(false);
  const context = useContext(OnboardContext);
  if (!Object.keys(context).length) {
    throw new Error(`UseConnection must be used within a Connection Provider.`);
  }

  const {
    state: { provider, onboard, signer, network, address, error, isConnected },
    dispatch,
    connect,
    disconnect,
  } = context;

  const addressRef = useRef(address);

  // When network changes, reconnect
  useEffect(() => {
    if (initOnboard) {
      // These are optional callbacks to be passed into onboard.
      const subscriptions = {
        address: (addr: string | null) => {
          dispatch({ type: actions.SET_ADDRESS, payload: addr });
          // Track the current reference to the address in order to
          // dispatch different types of actions.
          if (addressRef.current !== null) {
            disconnect(dispatch, onboard);
            addressRef.current = null;
          }
          addressRef.current = addr;
        },
        network: async (networkId: any) => {
          if (!SUPPORTED_NETWORK_IDS.includes(networkId) && networkId != null) {
            throw new Error(
              "This dApp will work only with the Mainnet or Kovan network"
            );
          }
          onboard?.config({ networkId });
          dispatch({
            type: actions.SET_NETWORK,
            payload: {
              chainId: networkId,
              name: getNetworkName(networkId as ChainId),
            },
          });
        },
        wallet: async (wallet: Wallet) => {
          if (wallet.provider) {
            const ethersProvider = new ethers.providers.Web3Provider(
              wallet.provider
            );
            dispatch({ type: actions.SET_PROVIDER, payload: ethersProvider });
            dispatch({
              type: actions.SET_SIGNER,
              payload: ethersProvider.getSigner(),
            });
            dispatch({
              type: actions.SET_NETWORK,
              payload: await ethersProvider.getNetwork(),
            });
          } else {
            dispatch({ type: actions.SET_PROVIDER, payload: null });
            dispatch({ type: actions.SET_NETWORK, payload: null });
          }
        },
      };

      connect(dispatch, network, subscriptions);
      setInitOnboard(false);
    }
  }, [
    network,
    connect,
    initOnboard,
    setInitOnboard,
    dispatch,
    onboard,
    disconnect,
  ]);

  return {
    provider,
    onboard,
    signer,
    network,
    address,
    error,
    isConnected,
    connect,
    disconnect: () => disconnect(dispatch, onboard),
    initOnboard,
    setInitOnboard,
  };
}
