import web3 from "web3";
import { PostCommitVote } from "common/web3/post/commitVotes";
import { PendingRequest } from "common/web3/get/queryGetPendingRequests";
import {
  computeVoteHashAncillary,
  getRandomSignedInt,
  encryptMessage,
  Request,
} from "common/tempUmaFunctions";
import toWei from "common/utils/web3/convertToWeiSafely";
import { getPrecisionForIdentifier, parseFixed } from "@uma/common";

import { FormData } from "../CommitPhase";
import setWith from "lodash.setwith";

export interface BackupCommit {
  [address: string]: {
    [roundId: string]: {
      [identifier: string]: string;
    };
  };
}

// For the hashing being done here, we must adhere to the format expected later in the process by revealVote.
// IE: identifier needs to be a hexstring, "yes" and "no" need to be 1 x 10**18 and 0 respectively, etc.
export async function formatVoteDataToCommit(
  data: FormData,
  activeRequests: PendingRequest[],
  roundId: string,
  address: string,
  publicKey: string
) {
  const postValues = [] as PostCommitVote[];
  let newCommits = {} as BackupCommit;
  const backupCommits = localStorage.getItem("backupCommits");
  if (backupCommits) {
    newCommits = { ...JSON.parse(backupCommits) };
  }

  await Promise.all(
    activeRequests.map(async (el) => {
      // Compute hash and encrypted vote
      const uniqueIdentifier = `${el.identifier}~${el.time}~${el.ancHex}`;
      if (Object.keys(data).includes(uniqueIdentifier)) {
        const datum = {} as PostCommitVote;
        // datum.identifier = stringToBytes32(el.identifier);
        datum.identifier = el.idenHex;
        // datum.time = el.time;
        datum.time = el.timeBN.toNumber();
        datum.ancillaryData = el.ancHex;
        let price = data[uniqueIdentifier];

        // change yes/no to numbers.
        // When converting price to wei here, we need precision
        // Default to 18 decimals -- could be different.
        if (price === "yes" || price === "no") {
          if (price === "no") {
            price = "0";
          } else {
            price = toWei("1").toString();
          }
        } else {
          const identifierPrecision = getPrecisionForIdentifier(
            web3.utils.hexToUtf8(el.idenHex)
          );

          price = parseFixed(price, identifierPrecision).toString();
          // Asked to be put here temporarily by @nickpai
          console.log("price to commit:", price);
        }

        const salt = getRandomSignedInt().toString();
        setWith(
          newCommits,
          `${address}.[${roundId}].${uniqueIdentifier}`,
          salt,
          Object
        );

        const r: Request = {
          price,
          salt,
          account: address,
          time: el.timeBN.toNumber(),
          roundId: Number(roundId),
          identifier: el.idenHex,
          ancillaryData: el.ancHex,
        };
        const hash = computeVoteHashAncillary(r);
        if (hash) {
          datum.hash = hash;
        }
        if (address) {
          const encryptedVote = await encryptMessage(
            publicKey,
            JSON.stringify({ price, salt })
          );
          datum.encryptedVote = encryptedVote;
        }
        postValues.push(datum);
      }
    })
  );

  return { postValues, newCommits };
}
