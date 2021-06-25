import { SigningKeys } from "App";

// export default function getSigningKeys(
//   signingKeys: SigningKeys,
//   hexMessage: string,
//   votingAddress: string | null,
//   hotAddress: string | null
// ) {
//   const keys = {
//     publicKey: "",
//     privateKey: "",
//   };

//   if (hexMessage && votingAddress && Object.keys(signingKeys).length) {
//     if (hotAddress) {
//       keys.privateKey = signingKeys[hexMessage][hotAddress]
//         ? signingKeys[hexMessage][hotAddress].privateKey
//         : "";
//       keys.publicKey = signingKeys[hexMessage][hotAddress]
//         ? signingKeys[hexMessage][hotAddress].publicKey
//         : "";
//     } else {
//       keys.privateKey = signingKeys[hexMessage][votingAddress]
//         ? signingKeys[hexMessage][votingAddress].privateKey
//         : "";
//       keys.publicKey = signingKeys[hexMessage][votingAddress]
//         ? signingKeys[hexMessage][votingAddress].publicKey
//         : "";
//     }
//   }

//   return keys;
// }

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
