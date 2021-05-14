import EthCrypto from "eth-crypto";
// Converts an ethereum public key to the corresponding address.
export default function addressFromPublicKey(publicKey: string) {
  // substr(2) just removes the web3 friendly "0x" from the public key.
  return EthCrypto.publicKey.toAddress(publicKey);
}
