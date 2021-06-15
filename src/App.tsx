import { useContext, useEffect, useState } from "react";
import Router from "features/router";
import { QueryClient } from "react-query";
import usePrevious from "common/hooks/usePrevious";
import { ToastContainer, toast } from "react-toastify";

// Context
import { ErrorContext } from "common/context/ErrorContext";
import { OnboardContext } from "common/context/OnboardContext";

import { recoverPublicKey } from "./features/vote/helpers/recoverPublicKey";
import { derivePrivateKey } from "./features/vote/helpers/derivePrivateKey";
import { useCurrentRoundId } from "hooks";
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
  const [signingKeys, setSigningKeys] = useState<SigningKeys>({});

  const { state, disconnect, dispatch } = useContext(OnboardContext);
  const { error, removeError, addError } = useContext(ErrorContext);
  const { data: roundId = "" } = useCurrentRoundId();
  const previousSigner = usePrevious(state.signer);
  const previousAddress = usePrevious(state.address);
  useEffect(() => {
    if (
      state.signer &&
      state.address &&
      roundId &&
      (previousAddress === null || previousSigner === null)
    ) {
      const address = state.address;
      const message = `UMA Protocol one time key for round: ${roundId}`;
      const keyExists = signingKeys[address];
      if (!keyExists || keyExists.roundMessage !== message) {
        state.signer
          .signMessage(message)
          .then((msg) => {
            const key = {} as {
              publicKey: string;
              privateKey: string;
              roundMessage: string;
            };

            const privateKey = derivePrivateKey(msg);
            const publicKey = recoverPublicKey(privateKey);
            key.privateKey = privateKey;
            key.publicKey = publicKey;
            key.roundMessage = message;

            setSigningKeys((prevKeys) => {
              return { ...prevKeys, [address]: key };
            });
          })
          .catch((err) => {
            const error = new Error("Sign failed.");
            addError(error);
          });
      }
    }
  }, [
    state.signer,
    state.address,
    signingKeys,
    addError,
    previousAddress,
    previousSigner,
    roundId,
  ]);

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
  }, [state.network, previousNetwork]);

  // Disconnect user if they are looged in and they switch accounts in MM
  useEffect(() => {
    if (previousAddress && state.address && previousAddress !== state.address) {
      disconnect(dispatch, state.onboard);
    }
  }, [state.address, previousAddress, dispatch, state.onboard, disconnect]);

  return (
    <div className="App">
      <Router signingKeys={signingKeys} />
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
