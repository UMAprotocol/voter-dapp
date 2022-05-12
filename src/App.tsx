import { useContext, useEffect } from "react";
import Router from "features/router";
import { QueryClient } from "react-query";
import usePrevious from "common/hooks/usePrevious";
import { ToastContainer, toast } from "react-toastify";

// Context
import { ErrorContext } from "common/context/ErrorContext";
import { OnboardContext } from "common/context/OnboardContext";

import { useCurrentRoundId } from "hooks";
import useSigningKeys from "hooks/useSigningKeys";
interface Props {
  queryClient: QueryClient;
}

export interface SigningKeys {
  [key: string]: {
    publicKey: string;
    privateKey: string;
    roundMessage: string;
  };
}

function App(props: Props) {
  const { state, disconnect, dispatch } = useContext(OnboardContext);
  const { error, removeError } = useContext(ErrorContext);
  const { data: roundId = "" } = useCurrentRoundId();
  const { signingKeys, setSigningKeys } = useSigningKeys(
    state.signer,
    state.address,
    roundId
  );

  const previousAddress = usePrevious(state.address);

  useEffect(() => {
    if (error)
      toast.error(error, {
        onClick: () => removeError(),
        closeButton: <span onClick={() => removeError()}>X</span>,
      });
  }, [error, removeError]);

  useEffect(() => {
    if (!state.isConnected) {
      props.queryClient.clear();
    }
  }, [state.isConnected, state.address, props.queryClient]);

  // Do a hard refresh if the user changes networks (IE: mainnet to kovan).
  // Cleaner overall, as the app can error out with network changes.
  // Not a big deal as in production this app is only supported on mainnet anyway.
  const previousNetwork = usePrevious(state.network);

  useEffect(() => {
    if (
      previousNetwork &&
      state.network &&
      state.network.chainId !== previousNetwork.chainId
    ) {
      setSigningKeys({});
      window.location.reload();
    }
  }, [state.network, previousNetwork, setSigningKeys]);

  // Disconnect user if they are looged in and they switch accounts in MM
  useEffect(() => {
    if (previousAddress && state.address && previousAddress !== state.address) {
      disconnect(dispatch, state.onboard);
      props.queryClient.clear();
    }
  }, [
    state.address,
    previousAddress,
    dispatch,
    state.onboard,
    disconnect,
    props.queryClient,
  ]);

  return (
    <div className="App">
      <Router signingKeys={signingKeys} account={state.address} />
      <ToastContainer
        position="top-right"
        autoClose={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
      />
    </div>
  );
}

export default App;
