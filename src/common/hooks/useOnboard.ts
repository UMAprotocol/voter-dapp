import { useContext, useEffect, useState } from "react";
import { OnboardContext, actions } from "common/context/OnboardContext";
import { ethers } from "ethers";
import { Wallet } from "bnc-onboard/dist/src/interfaces";
import Notify from "bnc-notify";

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
    state: {
      provider,
      onboard,
      signer,
      network,
      address,
      error,
      isConnected,
      notify,
    },
    dispatch,
    connect,
    disconnect,
  } = context;

  // When network changes, reconnect
  useEffect(() => {
    if (initOnboard) {
      // These are optional callbacks to be passed into onboard.
      const subscriptions = {
        address: (addr: string | null) => {
          dispatch({ type: actions.SET_ADDRESS, payload: addr });
        },
        network: async (networkId: any) => {
          dispatch({
            type: actions.SET_NETWORK,
            payload: {
              chainId: networkId,
              name: getNetworkName(networkId as ChainId),
            },
          });

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
    notify,
  };
}
