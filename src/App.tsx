import { useContext, useEffect, useState, useCallback } from "react";
import Router from "features/router";
import { QueryClient } from "react-query";
import usePrevious from "common/hooks/usePrevious";
import { ToastContainer, toast } from "react-toastify";
import web3 from "web3";

// Context
import { ErrorContext } from "common/context/ErrorContext";
import { OnboardContext } from "common/context/OnboardContext";

import { recoverPublicKey } from "./features/vote/helpers/recoverPublicKey";
import { derivePrivateKey } from "./features/vote/helpers/derivePrivateKey";

import currentSigningMessage from "common/currentSigningMessage";
import { useCurrentRoundId } from "hooks";

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

  // const signMessage = useCallback(() => {
  //   state.signer
  //   .signMessage(message)
  //   .then((msg) => {
  //     const key = {} as { publicKey: string; privateKey: string };

  //     const privateKey = derivePrivateKey(msg);
  //     const publicKey = recoverPublicKey(privateKey);
  //     key.privateKey = privateKey;
  //     key.publicKey = publicKey;

  //     const updatedKeys = {
  //       ...keys,
  //       [hashedMessage]: { ...keys[hashedMessage], [address]: key },
  //     };

  //     localStorage.setItem(
  //       SIGNING_KEYS_STORAGE_KEY,
  //       JSON.stringify(updatedKeys)
  //     );

  //     setSigningKeys(updatedKeys);
  //   })
  //   .catch((err) => {
  //     const error = new Error("Sign failed.");
  //     addError(error);
  //   });
  // }, []);

  useEffect(() => {
    if (state.signer && state.address) {
      const address = state.address;
      const message = currentSigningMessage(Number(currentRoundId)).message;
      const hashedMessage = currentSigningMessage(
        Number(currentRoundId)
      ).hashedMessage;

      const keysString = localStorage.getItem(SIGNING_KEYS_STORAGE_KEY);
      if (keysString) {
        const keys = JSON.parse(keysString) as SigningKeys;
        const keyExists = keys[hashedMessage][address];
        if (!keyExists) {
          state.signer
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
        } else {
          setSigningKeys(keys);
        }
      } else {
        state.signer
          .signMessage(message)
          .then((msg) => {
            const key = {} as { publicKey: string; privateKey: string };

            const privateKey = derivePrivateKey(msg);
            const publicKey = recoverPublicKey(privateKey);
            key.privateKey = privateKey;
            key.publicKey = publicKey;

            const ks = JSON.stringify({ [hashedMessage]: { [address]: key } });
            localStorage.setItem(SIGNING_KEYS_STORAGE_KEY, ks);
            setSigningKeys((prevKeys) => {
              return { ...prevKeys, [hashedMessage]: { [address]: key } };
            });
          })
          .catch((err) => {
            const error = new Error("Sign failed.");
            addError(error);
          });
      }
    } else {
      setSigningKeys({});
    }
  }, [state.signer, state.address, addError, currentRoundId]);

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
