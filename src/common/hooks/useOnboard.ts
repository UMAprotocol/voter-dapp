import { useContext, useState } from "react";
import { OnboardContext } from "common/context/OnboardContext";

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

  return {
    provider,
    onboard,
    signer,
    network,
    address,
    error,
    isConnected,
    connect: () => connect(dispatch, onboard),
    disconnect: () => disconnect(dispatch, onboard),
    initOnboard,
    setInitOnboard,
    notify,
  };
}
