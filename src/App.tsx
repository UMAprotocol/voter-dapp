import { useContext, useEffect, useState, useCallback } from "react";
import Router from "features/router";
import { QueryClient } from "react-query";
import usePrevious from "common/hooks/usePrevious";
import { ToastContainer, toast } from "react-toastify";

// Context
import { ErrorContext } from "common/context/ErrorContext";
import { OnboardContext } from "common/context/OnboardContext";

import { recoverPublicKey } from "./features/vote/helpers/recoverPublicKey";
import { derivePrivateKey } from "./features/vote/helpers/derivePrivateKey";

import currentSigningMessage from "common/currentSigningMessage";
import { useCurrentRoundId } from "hooks";
import { ethers } from "ethers";

interface Props {
  queryClient: QueryClient;
}

export interface SigningKey {
  [key: string]: {
    publicKey: string;
    privateKey: string;
  };
}

export interface SigningKeys {
  [key: string]: SigningKey;
}

const SIGNING_KEYS_STORAGE_KEY = "signingKeys";

function App(props: Props) {
  const [signingKeys, setSigningKeys] = useState<SigningKeys>({});

  const { state, disconnect, dispatch } = useContext(OnboardContext);
  const { error, removeError, addError } = useContext(ErrorContext);
  const { data: currentRoundId } = useCurrentRoundId();

  const signMessage = useCallback(
    (
      keys: SigningKeys,
      address: string,
      signer: ethers.Signer,
      currentRoundId: string
    ) => {
      const message = currentSigningMessage(Number(currentRoundId)).message;
      const hashedMessage = currentSigningMessage(
        Number(currentRoundId)
      ).hashedMessage;

      return signer
        .signMessage(message)
        .then((msg) => {
          const key = {} as { publicKey: string; privateKey: string };

          const privateKey = derivePrivateKey(msg);
          const publicKey = recoverPublicKey(privateKey);
          key.privateKey = privateKey;
          key.publicKey = publicKey;

          const updatedKeys = {
            ...keys,
            [hashedMessage]: { ...keys[hashedMessage], [address]: key },
          };

          localStorage.setItem(
            SIGNING_KEYS_STORAGE_KEY,
            JSON.stringify(updatedKeys)
          );

          setSigningKeys(updatedKeys);
        })
        .catch((err) => {
          const error = new Error("Sign failed.");
          addError(error);
        });
    },
    [addError]
  );

  useEffect(() => {
    if (state.signer && state.address && currentRoundId && addError) {
      const address = state.address;
      const hashedMessage = currentSigningMessage(
        Number(currentRoundId)
      ).hashedMessage;

      try {
        const keysString =
          localStorage.getItem(SIGNING_KEYS_STORAGE_KEY) || "{}";
        const keys = JSON.parse(keysString) as SigningKeys;
        const keyExists = keys[hashedMessage][address];
        if (!keyExists) {
          signMessage(keys, state.address, state.signer, currentRoundId);
        } else {
          console.log("here thrice");
          setSigningKeys(keys);
        }
      } catch (err) {
        const keys = {} as SigningKeys;
        signMessage(keys, state.address, state.signer, currentRoundId);
      }
    } else {
      setSigningKeys({});
    }
  }, [state.signer, state.address, addError, currentRoundId, signMessage]);

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
      window.location.reload();
    }
  }, [state.network, previousNetwork]);

  // Disconnect user if they are looged in and they switch accounts in MM
  const previousAddress = usePrevious(state.address);
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
