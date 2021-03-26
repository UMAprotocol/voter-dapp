import { useContext, useCallback } from "react";
import { ConnectionContext, EMPTY } from "common/context/ConnectionContext";
import { ethers } from "ethers";
import Onboard from "bnc-onboard";
import { Wallet } from "bnc-onboard/dist/src/interfaces";
import config, { SUPPORTED_NETWORK_IDS } from "common/config";

export function useConnection() {
  const context = useContext(ConnectionContext);
  if (context === EMPTY) {
    throw new Error(`UseConnection must be used within a Connection Provider.`);
  }
  const [
    { provider, onboard, signer, network, address, error, isConnected },
    dispatch,
  ] = context;
  const connect = useCallback(async () => {
    try {
      const onboardInstance = Onboard({
        dappId: config(network).onboardConfig.apiKey,
        hideBranding: true,
        networkId: 1, // Default to main net. If on a different network will change with the subscription.
        subscriptions: {
          address: (address: string | null) => {
            dispatch({ type: "set address", address });
          },
          network: async (networkId: any) => {
            if (
              !SUPPORTED_NETWORK_IDS.includes(networkId) &&
              networkId != null
            ) {
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
              dispatch({ type: "set provider", provider: ethersProvider });
              dispatch({
                type: "set signer",
                signer: ethersProvider.getSigner(),
              });
              dispatch({
                type: "set network",
                network: await ethersProvider.getNetwork(),
              });
            } else {
              dispatch({ type: "set provider", provider: null });
              dispatch({ type: "set network", network: null });
            }
          },
        },
        walletSelect: config(network).onboardConfig.onboardWalletSelect,
        walletCheck: config(network).onboardConfig.walletCheck,
      });
      await onboardInstance.walletSelect();
      await onboardInstance.walletCheck();

      dispatch({ type: "set onboard", onboard: onboardInstance });
      dispatch({ type: "set connection status", isConnected: true });
    } catch (error) {
      dispatch({ type: "set error", error });
    }
  }, [dispatch, network, onboard]);

  const disconnect = useCallback(() => {
    if (!isConnected) {
      return;
    }
    onboard?.walletReset();
    dispatch({ type: "set address", address: null });
    dispatch({ type: "set provider", provider: null });
    dispatch({ type: "set signer", signer: null });
    dispatch({ type: "set network", network: null });
    dispatch({ type: "set connection status", isConnected: false });
    dispatch({ type: "set onboard", onboard: null });
  }, [dispatch, isConnected, onboard]);
  return {
    provider,
    onboard,
    signer,
    network,
    address,
    error,
    isConnected,
    connect,
    disconnect,
  };
}
