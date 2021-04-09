// Pulled from @uma/common temporarily, as it has no type declarations.
// remove any dependencies in here later.
import EthCrypto from "eth-crypto";
import web3 from "web3";

export async function encryptMessage(pubKey: string, message: string) {
  const encryptedMessageObject = await EthCrypto.encryptWithPublicKey(
    pubKey,
    message
  );
  return "0x" + EthCrypto.cipher.stringify(encryptedMessageObject);
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

// Commit vote from old voter dapp
/*

  const onSaveHandler = async () => {
    const commits = [];
    const indicesCommitted = [];

    // We'll mark all of these potential commits with the same timestamp
    // for the user's convenience.
    const encryptionTimestamp = Date.now();

    for (const index in editState) {
      if (!checkboxesChecked[index] || !editState[index]) {
        continue;
      }
      const identifierPrecision = getPrecisionForIdentifier(hexToUtf8(pendingRequests[index].identifier));
      const price = parseFixed(editState[index], identifierPrecision).toString();
      const salt = getRandomSignedInt().toString();
      const ancillaryData = pendingRequests[index].ancillaryData || DEFAULT_ANCILLARY_DATA;
      const encryptedVote = await encryptMessage(
        decryptionKeys[account][currentRoundId].publicKey,
        JSON.stringify({ price, salt })
      );
      commits.push({
        identifier: pendingRequests[index].identifier,
        time: pendingRequests[index].time,
        ancillaryData,
        hash: computeVoteHashAncillary({
          price,
          salt,
          account: votingAccount,
          time: pendingRequests[index].time,
          roundId: currentRoundId,
          identifier: pendingRequests[index].identifier,
          ancillaryData
        }),
        encryptedVote
      });
      indicesCommitted.push(index);

      // Store price and salt that we will attempt to encrypt on-chain in a cookie. This way, if the encryption
      // (or subsequent decryption) fails, then the user can still recover their committed price and salt and
      // reveal their commit manually. Note that this will store a cookie for each call to `encryptMessage`, even
      // if the user never signs and submits the `batchCommitFunction` to commit their vote on-chain. Therefore,
      // the cookies could store more hash data than the user ends up committing on-chain. It is the user's
      // responsibility to determine which commit data to use.
      const newCommitKey = toVotingAccountAndPriceRequestKey(
        votingAccount,
        pendingRequests[index].identifier,
        pendingRequests[index].time,
        ancillaryData
      );
      const updatedCommitBackups = Object.assign(
        {},
        {
          ...cookies[newCommitKey],
          [encryptionTimestamp]: {
            salt,
            price,
            identifierPrecision,
            ancillaryData
          }
        }
      );
      setCookie(newCommitKey, updatedCommitBackups, { path: "/" });
    }
    if (commits.length < 1) {
      return;
    }

    // Prompt user to sign transaction. After this function is called, the `commitStatus` is reset to undefined.
    // Note that `commitStatus` for this transaction will fail to update correctly if the user hits "Save" again
    // and enqueues another transaction to sign. Therefore, `commitStatus` only tracks the status of the most recent
    // transaction that Drizzle sends to MetaMask to sign.
    batchCommitFunction(commits, { from: account });
    setCheckboxesChecked({});
    dispatchEditState({ type: "SUBMIT_COMMIT", indicesCommitted });
  };
  */
