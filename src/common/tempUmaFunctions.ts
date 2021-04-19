// Pulled from @uma/common temporarily, as it has no type declarations.
// remove any dependencies in here later.
import EthCrypto from "eth-crypto";
import Web3 from "web3";
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

export interface Request {
  price: string;
  salt: string;
  account: string;
  time: number;
  ancillaryData: string;
  roundId: number;
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

// Signs a message in a way where it can be verified onchain by the openzeppelin ECDSA library.
export async function signMessage(
  web3: Web3,
  message: string,
  account: string
) {
  // Must hash the inner message because Solidity requires a fixed length message to verify a signature.
  const innerMessageHash = await web3.utils.soliditySha3(message);
  if (innerMessageHash) {
    // Construct a signature that will be accepted by openzeppelin.
    // See https://github.com/OpenZeppelin/openzeppelin-solidity/blob/1e584e495782ebdb5096fe65037d99dae1cbe940/contracts/cryptography/ECDSA.sol#L53
    // and https://medium.com/@yaoshiang/ethereums-ecrecover-openzeppelin-s-ecdsa-and-web3-s-sign-8ff8d16595e1 for details.
    const mutableSignature = await web3.eth.sign(innerMessageHash, account);
    const rs = mutableSignature.slice(0, 128 + 2);
    let v = mutableSignature.slice(128 + 2, 130 + 2);
    if (v === "00") {
      v = "1b";
    } else if (v === "01") {
      v = "1c";
    }
    return rs + v;
  }
}

// The methods to get signatures in MetaMask and Truffle are different and return slightly different results.
export async function getMessageSignatureMetamask(
  web3: Web3,
  messageToSign: string,
  signingAccount: string
) {
  return await web3.eth.sign(messageToSign, signingAccount);
}
