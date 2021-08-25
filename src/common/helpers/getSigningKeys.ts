import { SigningKeys } from "App";

export default function getSigningKeys(
  signingKeys: SigningKeys,
  address: string | null
) {
  const keys = {
    publicKey: "",
    privateKey: "",
  };

  if (address && Object.keys(signingKeys).length) {
    keys.privateKey = signingKeys[address]
      ? signingKeys[address].privateKey
      : "";
    keys.publicKey = signingKeys[address] ? signingKeys[address].publicKey : "";
  }

  return keys;
}
