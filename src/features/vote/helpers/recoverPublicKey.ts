import EthCrypto from "eth-crypto";

export function recoverPublicKey(privateKey: string) {
  // The "0x" is added to make the public key web3 friendly.
  // return "0x" + EthCrypto.publicKeyByPrivateKey(privateKey);
  return EthCrypto.publicKeyByPrivateKey(privateKey);
}
