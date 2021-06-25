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
import web3 from "web3";
import has from "lodash.has";
import setWith from "lodash.setwith";

interface Props {
  queryClient: QueryClient;
}

interface SigningKey {
  publicKey: string;
  privateKey: string;
  roundMessage: string;
  roundId: string;
}

export interface SigningKeys {
  [address: string]: SigningKey;
}

interface StorageKeys {
  // Signing message turned to hex.
  [hexMessage: string]: SigningKeys;
}

const SIGNING_KEYS_STORAGE_KEY = "signingKeys";

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
      const hexMessage = web3.utils.toHex(message);
      const keyExists = signingKeys[address];
      let keysInStorage =
        localStorage.getItem(SIGNING_KEYS_STORAGE_KEY) || ({} as StorageKeys);

      let keyExistsInStorage = false;
      if (typeof keysInStorage === "string") {
        keysInStorage = JSON.parse(keysInStorage) as StorageKeys;

        keyExistsInStorage = has(keysInStorage, `${hexMessage}.${address}`);
      }

      console.log("key in local storage?", keyExistsInStorage);
      if (keyExistsInStorage) {
        const loggedInKey = keysInStorage[hexMessage][address];
        console.log("logged in key", loggedInKey);
        setSigningKeys((prevKeys) => {
          return { ...prevKeys, [address]: loggedInKey };
        });
      } else {
        if (!keyExists || keyExists.roundMessage !== message) {
          state.signer
            .signMessage(message)
            .then((msg) => {
              const key = {} as SigningKey;

              const privateKey = derivePrivateKey(msg);
              const publicKey = recoverPublicKey(privateKey);
              key.privateKey = privateKey;
              key.publicKey = publicKey;
              key.roundMessage = message;
              key.roundId = roundId;

              let keysToBackup = {};
              if (typeof keysInStorage === "string") {
                const parsedJSON = JSON.parse(keysInStorage);
                keysToBackup = { ...parsedJSON };
              }

              setWith(keysToBackup, `${hexMessage}.${address}`, key, Object);
              localStorage.setItem(
                SIGNING_KEYS_STORAGE_KEY,
                JSON.stringify(keysToBackup)
              );
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
