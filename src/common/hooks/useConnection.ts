import { useContext, useEffect, useState } from "react";
import { OnboardContext, actions } from "common/context/OnboardContext";
import { ethers } from "ethers";
import { Wallet } from "bnc-onboard/dist/src/interfaces";
import { SUPPORTED_NETWORK_IDS } from "common/config";

export default function useConnection() {
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

  // When network changes, reconnect
  useEffect(() => {
    if (initOnboard) {
      // These are optional callbacks to be passed into onboard.
      const subscriptions = {
        address: (address: string | null) => {
          dispatch({ type: actions.SET_ADDRESS, payload: address });
        },
        network: async (networkId: any) => {
          if (!SUPPORTED_NETWORK_IDS.includes(networkId) && networkId != null) {
            throw new Error(
              "This dApp will work only with the Mainnet or Kovan network"
            );
          }
          onboard?.config({ networkId: networkId });
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
  }, [network, connect, initOnboard, setInitOnboard, dispatch, onboard]);

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
