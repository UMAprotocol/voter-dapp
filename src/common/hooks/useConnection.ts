import { useContext, useCallback, useEffect } from "react";
import {
  ConnectionContext,
  EMPTY,
  actions,
} from "common/context/ConnectionContext";
import { ethers } from "ethers";
import { Wallet } from "bnc-onboard/dist/src/interfaces";
import { SUPPORTED_NETWORK_IDS } from "common/config";

import createOnboardInstance from "common/utils/createOnboardInstance";

// Working old version
// export function useConnection() {
//   const context = useContext(ConnectionContext);
//   if (context === EMPTY) {
//     throw new Error(`UseConnection must be used within a Connection Provider.`);
//   }
//   const [
//     { provider, onboard, signer, network, address, error, isConnected },
//     dispatch,
//   ] = context;
//   const connect = useCallback(async () => {
//     try {
//       const onboardInstance = Onboard({
//         dappId: config(network).onboardConfig.apiKey,
//         hideBranding: true,
//         networkId: 1, // Default to main net. If on a different network will change with the subscription.
//         subscriptions: {
//           address: (address: string | null) => {
//             dispatch({ type: actions.SET_ADDRESS, payload: address });
//           },
//           network: async (networkId: any) => {
//             if (
//               !SUPPORTED_NETWORK_IDS.includes(networkId) &&
//               networkId != null
//             ) {
//               throw new Error(
//                 "This dApp will work only with the Mainnet or Kovan network"
//               );
//             }
//             onboard?.config({ networkId: networkId });
//           },
//           wallet: async (wallet: Wallet) => {
//             if (wallet.provider) {
//               const ethersProvider = new ethers.providers.Web3Provider(
//                 wallet.provider
//               );
//               dispatch({ type: actions.SET_PROVIDER, payload: ethersProvider });
//               dispatch({
//                 type: actions.SET_SIGNER,
//                 payload: ethersProvider.getSigner(),
//               });
//               dispatch({
//                 type: actions.SET_NETWORK,
//                 payload: await ethersProvider.getNetwork(),
//               });
//             } else {
//               dispatch({ type: actions.SET_PROVIDER, payload: null });
//               dispatch({ type: actions.SET_NETWORK, payload: null });
//             }
//           },
//         },
//         walletSelect: config(network).onboardConfig.onboardWalletSelect,
//         walletCheck: config(network).onboardConfig.walletCheck,
//       });
//       await onboardInstance.walletSelect();
//       await onboardInstance.walletCheck();

//       dispatch({ type: actions.SET_ONBOARD, payload: onboardInstance });
//       dispatch({ type: actions.SET_CONNECTION_STATUS, payload: true });
//     } catch (error) {
//       dispatch({ type: actions.SET_ERROR, payload: error });
//     }
//   }, [dispatch, network, onboard]);

//   const disconnect = useCallback(() => {
//     if (!isConnected) {
//       return;
//     }
//     onboard?.walletReset();
//     dispatch({ type: actions.RESET_STATE });
//   }, [dispatch, isConnected, onboard]);
//   return {
//     provider,
//     onboard,
//     signer,
//     network,
//     address,
//     error,
//     isConnected,
//     connect,
//     disconnect,
//   };
// }

export function useConnection() {
  const context = useContext(ConnectionContext);
  if (context === EMPTY) {
    throw new Error(`UseConnection must be used within a Connection Provider.`);
  }
  const [
    { provider, onboard, signer, network, address, error, isConnected },
    dispatch,
    connect,
    disconnect,
  ] = context;

  // When network changes, reconnect
  useEffect(() => {
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
  }, [network]);

  // Disconnect and reset state on change;
  useEffect(() => {
    disconnect(dispatch, isConnected, onboard);
  }, [isConnected, onboard]);

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
