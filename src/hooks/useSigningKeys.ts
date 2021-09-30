import { ethers } from "ethers";
import { useState, useEffect, useContext } from "react";
import { ErrorContext } from "common/context/ErrorContext";

export interface SigningKeys {
  [key: string]: {
    publicKey: string;
    privateKey: string;
    roundMessage: string;
  };
}

import { recoverPublicKey } from "features/vote/helpers/recoverPublicKey";
import { derivePrivateKey } from "features/vote/helpers/derivePrivateKey";
import usePrevious from "common/hooks/usePrevious";

export default function useSigningKeys(
  signer: ethers.Signer | null,
  address: string,
  roundId: string
) {
  const [signingKeys, setSigningKeys] = useState<SigningKeys>({});

  const { addError } = useContext(ErrorContext);

  const previousSigner = usePrevious(signer);
  const previousAddress = usePrevious(address);

  useEffect(() => {
    if (
      signer &&
      address &&
      roundId &&
      (previousAddress === null || previousSigner === null)
    ) {
      const message = `UMA Protocol one time key for round: ${roundId}`;
      const keyExists = signingKeys[address];
      if (!keyExists || keyExists.roundMessage !== message) {
        signer
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
    signer,
    address,
    signingKeys,
    addError,
    previousAddress,
    previousSigner,
    roundId,
  ]);

  return signingKeys;
}
