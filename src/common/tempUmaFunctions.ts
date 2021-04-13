// Pulled from @uma/common temporarily, as it has no type declarations.
// remove any dependencies in here later.
import EthCrypto from "eth-crypto";
import web3 from "web3";

export async function encryptMessage(pubKey: string, message: string) {
  // substr(2) removes the web3 friendly "0x" from the public key.
  const encryptedMessageObject = await EthCrypto.encryptWithPublicKey(
    pubKey,
    message
  );
  return "0x" + EthCrypto.cipher.stringify(encryptedMessageObject);
}
// Decrypts a message that was encrypted using encryptMessage().
export async function decryptMessage(
  privKey: string,
  encryptedMessage: string
) {
  // substr(2) just removes the 0x at the beginning. parse() reverses the stringify() in encryptMessage().
  const encryptedMessageObject = EthCrypto.cipher.parse(
    encryptedMessage.substr(2)
  );
  return await EthCrypto.decryptWithPrivateKey(privKey, encryptedMessageObject);
}

interface Request {
  price: string;
  salt: string;
  account: string;
  time: string;
  ancillaryData: string;
  roundId: string;
  identifier: string;
}

export function computeVoteHashAncillary(request: Request) {
  return web3.utils.soliditySha3(
    { t: "int", v: request.price },
    { t: "int", v: request.salt },
    { t: "address", v: request.account },
    { t: "uint", v: request.time },
    { t: "bytes", v: request.ancillaryData },
    { t: "uint", v: request.roundId },
    { t: "bytes32", v: request.identifier }
  );
}

export function getRandomSignedInt() {
  const unsignedValue = getRandomUnsignedInt();

  // The signed range is just the unsigned range decreased by 2^255.
  const signedOffset = web3.utils.toBN(2).pow(web3.utils.toBN(255));
  return unsignedValue.sub(signedOffset);
}

// Generate a random unsigned 256 bit int.
function getRandomUnsignedInt() {
  return web3.utils.toBN(web3.utils.randomHex(32));
}
