import { DateTime } from "luxon";
// import { PriceRound } from "web3/queryVotingContractEvents";
import { ethers } from "ethers";
import web3 from "web3";
import { PriceRequestRound } from "common/hooks/useVoteData";
import { queryRetrieveRewards } from "web3/queryVotingContractMethods";
import { PastRequest } from "./PastRequests";
import { PostCommitVote } from "web3/postVotingContractMethods";
import { PendingRequest } from "web3/queryVotingContractMethods";
import stringToBytes32 from "common/utils/web3/stringToBytes32";
import {
  computeVoteHashAncillary,
  getRandomSignedInt,
  encryptMessage,
} from "common/tempUmaFunctions";

import { FormData } from "./ActiveRequestsForm";

// const ACTIVE_DAYS_CONSTANT = 2.5;

// export function isActiveRequest(round: PriceRound) {
//   const currentTime = DateTime.local();
//   const roundTime = DateTime.fromSeconds(Number(round.time));
//   const diff = currentTime.diff(roundTime, ["days"]).toObject();
//   const { days } = diff;
//   if (days) {
//     return days > 0 && days <= ACTIVE_DAYS_CONSTANT ? true : false;
//   } else {
//     return false;
//   }
// }

// export function isPastRequest(round: PriceRound) {
//   const currentTime = DateTime.local();
//   const roundTime = DateTime.fromSeconds(Number(round.time));
//   const diff = currentTime.diff(roundTime, ["days"]).toObject();
//   const { days } = diff;
//   if (days) {
//     return days > 0 && days > ACTIVE_DAYS_CONSTANT ? true : false;
//   } else {
//     return false;
//   }
// }

// Sorts and sets some default values for when the user isn't logged in.
export function formatPastRequestsNoAddress(data: PriceRequestRound[]) {
  const sortedByTime = data.slice().sort((a, b) => {
    if (Number(b.time) > Number(a.time)) return 1;
    if (Number(b.time) < Number(a.time)) return -1;
    return 0;
  });

  const formattedData = sortedByTime.map((el) => {
    const datum = {} as PastRequest;
    datum.proposal = el.identifier.id;
    datum.correct = "N/A";
    datum.vote = "N/A";
    datum.reward = "N/A";
    datum.rewardCollected = true;
    datum.timestamp = DateTime.fromSeconds(Number(el.time)).toLocaleString({
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h24",
      timeZoneName: "short",
    });
    return datum;
  });

  return formattedData;
}

export function formatPastRequestsByAddress(
  data: PriceRequestRound[],
  address: string,
  contract: ethers.Contract | null
) {
  const sortedByTime = data.slice().sort((a, b) => {
    if (Number(b.time) > Number(a.time)) return 1;
    if (Number(b.time) < Number(a.time)) return -1;
    return 0;
  });
  const formattedData = sortedByTime.map(async (el, index) => {
    // Determine correct vote
    // Apparently price is null on some of these, so do a null check.
    let correct = ethers.utils.formatEther(
      el.request.price !== null ? el.request.price : "0"
    );
    if (el.identifier.id.includes("Admin")) {
      correct = Number(correct) > 0 ? "YES" : "NO";
    }

    let vote = "N/A";
    const findVote = el.revealedVotes.find(
      (x) => x.voter.address.toLowerCase() === address.toLowerCase()
    );
    // if the name of the proposal includes "Admin", it is a true/false vote.
    if (findVote) {
      if (el.identifier.id.includes("Admin")) {
        vote = Number(findVote.price) > 0 ? "YES" : "NO";
      } else {
        vote = ethers.utils.formatEther(findVote.price);
      }
    }

    // Note: Rewards can be retrieved from the event after the user has
    // taken it. If they haven't, you must do a getPrice call to the contract from Governor address.
    let reward = "N/A";
    const findReward = el.rewardsClaimed.find(
      (x) => x.claimer.address.toLowerCase() === address.toLowerCase()
    );

    if (findReward) {
      reward = ethers.utils.formatEther(findReward.numTokens);
    } else {
      if (contract && findVote) {
        const checkIfRewardAvailable = await queryRetrieveRewards(
          contract,
          address,
          el.roundId,
          el.identifier.id,
          el.time
        );
        if (checkIfRewardAvailable) reward = checkIfRewardAvailable;
      }
    }

    // Determine if the user has revealed a vote and has not retrieved their rewards yet.
    let rewardCollected = true;
    if (!findReward && findVote) {
      rewardCollected = false;
    }

    const datum = {} as PastRequest;
    datum.proposal = el.identifier.id;
    datum.correct = correct;
    datum.vote = vote;
    datum.reward = reward;
    datum.rewardCollected = rewardCollected;
    datum.timestamp = DateTime.fromSeconds(Number(el.time)).toLocaleString({
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h24",
      timeZoneName: "short",
    });

    return datum;
  });
  return formattedData;
}

function toHex(str: string) {
  var hex, i;

  var result = "";
  for (i = 0; i < str.length; i++) {
    hex = str.charCodeAt(i).toString(16);
    result += ("000" + hex).slice(-4);
  }

  return `0x${result}`;
}

export async function formatVoteDataToCommit(
  data: FormData,
  activeRequests: PendingRequest[],
  roundId: string,
  address: string | null,
  publicKey: string
) {
  const postValues = [] as PostCommitVote[];
  await Promise.all(
    activeRequests.map(async (el) => {
      // Compute hash and encrypted vote
      if (Object.keys(data).includes(el.identifier)) {
        const datum = {} as PostCommitVote;
        datum.identifier = stringToBytes32(el.identifier);
        datum.time = Number(el.time);
        let ancData = "";

        // anc data is set to - or N/A in UI if empty, convert back to 0x.
        if (el.ancillaryData === "-" || el.ancillaryData === "N/A") {
          ancData = "0x";
        } else {
          // ancData = toHex(el.ancillaryData);
          // ancData = ethers.utils.hexlify(el.ancillaryData);
          ancData = web3.utils.utf8ToHex(el.ancillaryData);
          // ancData = ethers.utils.formatBytes32String(el.ancillaryData);
          // console.log(toUTF8Array(el.ancillaryData));
          // ancData = toUTF8Array(el.ancillaryData);
        }

        datum.ancillaryData = ancData;
        const price = data[el.identifier];
        const salt = getRandomSignedInt().toString();
        const hash = computeVoteHashAncillary({
          price,
          salt,
          account: address || "",
          time: el.time,
          roundId,
          identifier: el.identifier,
          ancillaryData: ancData,
        });
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

  return postValues;
}
