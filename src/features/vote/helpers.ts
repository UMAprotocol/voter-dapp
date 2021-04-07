import { DateTime } from "luxon";
import { PriceRound } from "web3/queryVotingContractEvents";
import { ethers } from "ethers";
import { PriceRequestRound } from "common/hooks/useVoteData";
import { queryRetrieveRewards } from "web3/queryVotingContractMethods";
import { PastRequest } from "./PastRequests";

const ACTIVE_DAYS_CONSTANT = 2.5;

export function isActiveRequest(round: PriceRound) {
  const currentTime = DateTime.local();
  const roundTime = DateTime.fromSeconds(Number(round.time));
  const diff = currentTime.diff(roundTime, ["days"]).toObject();
  const { days } = diff;
  if (days) {
    return days > 0 && days <= ACTIVE_DAYS_CONSTANT ? true : false;
  } else {
    return false;
  }
}

export function isPastRequest(round: PriceRound) {
  const currentTime = DateTime.local();
  const roundTime = DateTime.fromSeconds(Number(round.time));
  const diff = currentTime.diff(roundTime, ["days"]).toObject();
  const { days } = diff;
  if (days) {
    return days > 0 && days > ACTIVE_DAYS_CONSTANT ? true : false;
  } else {
    return false;
  }
}

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
    let correct = ethers.utils.formatEther(el.request.price);
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
