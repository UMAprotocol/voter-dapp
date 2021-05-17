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

interface Props {
  queryClient: QueryClient;
}

export interface SigningKeys {
  [key: string]: {
    publicKey: string;
    privateKey: string;
  };
}

function App(props: Props) {
  const [signingKeys, setSigningKeys] = useState<SigningKeys>({});

  const { state, disconnect, dispatch } = useContext(OnboardContext);
  const { error, removeError } = useContext(ErrorContext);

  useEffect(() => {
    if (state.signer && state.address) {
      const address = state.address;
      const message = "Login to UMA Voter dApp";
      const keyExists = signingKeys[address];
      if (!keyExists) {
        state.signer
          .signMessage(message)
          .then((msg) => {
            const key = {} as { publicKey: string; privateKey: string };

            const privateKey = derivePrivateKey(msg);
            const publicKey = recoverPublicKey(privateKey);
            key.privateKey = privateKey;
            key.publicKey = publicKey;

            setSigningKeys((prevKeys) => {
              return { ...prevKeys, [address]: key };
            });
          })
          .catch((err) => {
            console.log("Sign failed");
          });
      }
    }
  }, [state.signer, state.address, signingKeys]);

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
