import { PriceRequestRound } from "common/hooks/useVoteData";
import { PastRequest } from "../PastRequests";
import { DateTime } from "luxon";
import { ethers } from "ethers";
import { getPrecisionForIdentifier } from "@uma/common";

const NULL_CORRECT_STRING = "-";

export function formatPastRequestsByAddress(
  data: PriceRequestRound[],
  address: string
) {
  const sortedByTime = data.sort((a, b) => {
    if (Number(b.time) > Number(a.time)) return 1;
    if (Number(b.time) < Number(a.time)) return -1;
    return 0;
  });

  const formattedData = sortedByTime.map((el) => {
    // Determine correct vote
    // Apparently price is null on some of these, so do a null check.
    const identifierPrecision = getPrecisionForIdentifier(el.identifier.id);

    let correct =
      el.request.price !== null
        ? ethers.utils.formatUnits(el.request.price, identifierPrecision)
        : NULL_CORRECT_STRING;

    if (el.identifier.id.includes("Admin") && correct !== NULL_CORRECT_STRING) {
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
        vote = ethers.utils.formatUnits(findVote.price, identifierPrecision);
      }
    }

    let reward = "N/A";
    const findReward = el.rewardsClaimed.find(
      (x) => x.claimer.address.toLowerCase() === address.toLowerCase()
    );

    if (findReward) {
      reward = ethers.utils.formatEther(findReward.numTokens);
    }

    const datum = {} as PastRequest;
    datum.proposal = el.identifier.id;
    datum.correct = correct;
    datum.vote = vote;
    datum.reward = reward;
    datum.timestamp = DateTime.fromSeconds(Number(el.time)).toLocaleString({
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h24",
      timeZoneName: "short",
    });
    datum.unix = el.time;

    datum.numberCommitVoters = el.committedVotes.length;
    datum.numberRevealVoters = el.revealedVotes.length;

    // Double check the totalsupply has been indexed to avoid a null error.
    datum.totalSupply =
      el.totalSupplyAtSnapshot !== null
        ? Number(el.totalSupplyAtSnapshot).toFixed(6).toString()
        : "0";

    return datum;
  });

  return formattedData;
}
