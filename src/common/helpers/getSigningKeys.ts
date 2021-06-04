import { SigningKeys } from "App";

export default function getSigningKeys(
  signingKeys: SigningKeys,
  hashedMessage: string,
  votingAddress: string | null,
  hotAddress: string | null
) {
  const keys = {
    publicKey: "",
    privateKey: "",
  };

  if (hashedMessage && votingAddress && Object.keys(signingKeys).length) {
    if (hotAddress) {
      keys.privateKey = signingKeys[hashedMessage][hotAddress]
        ? signingKeys[hashedMessage][hotAddress].privateKey
        : "";
      keys.publicKey = signingKeys[hashedMessage][hotAddress]
        ? signingKeys[hashedMessage][hotAddress].publicKey
        : "";
    } else {
      keys.privateKey = signingKeys[hashedMessage][votingAddress]
        ? signingKeys[hashedMessage][votingAddress].privateKey
        : "";
      keys.publicKey = signingKeys[hashedMessage][votingAddress]
        ? signingKeys[hashedMessage][votingAddress].publicKey
        : "";
    }
  }

  return keys;
}
