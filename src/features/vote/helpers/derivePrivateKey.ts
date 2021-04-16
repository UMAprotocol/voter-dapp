import web3 from "web3";

export function derivePrivateKey(signature: string) {
  const pk = web3.utils.soliditySha3(signature);
  if (pk) return pk;
  return "";
}
