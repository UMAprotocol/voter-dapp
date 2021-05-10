import { PriceRequestRound } from "common/hooks/useVoteData";
import { PastRequest } from "../PastRequests";
import { DateTime } from "luxon";
import { ethers } from "ethers";
const NULL_CORRECT_STRING = "-";

// Sorts and sets some default values for when the user isn't logged in.
export function formatPastRequestsNoAddress(data: PriceRequestRound[]) {
  const sortedByTime = data.slice().sort((a, b) => {
    if (Number(b.time) > Number(a.time)) return 1;
    if (Number(b.time) < Number(a.time)) return -1;
    return 0;
  });

  const formattedData = sortedByTime.map((el) => {
    const datum = {} as PastRequest;
    let correct = ethers.utils.formatEther(
      el.request.price !== null ? el.request.price : NULL_CORRECT_STRING
    );

    if (el.identifier.id.includes("Admin") && correct !== NULL_CORRECT_STRING) {
      correct = Number(correct) > 0 ? "YES" : "NO";
    }

    datum.proposal = el.identifier.id;
    datum.correct = correct;
    datum.vote = "N/A";
    datum.reward = "N/A";
    datum.timestamp = DateTime.fromSeconds(Number(el.time)).toLocaleString({
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h24",
      timeZoneName: "short",
    });

    // find the unique commits
    const numberCommitVoters = el.committedVotes
      .map((item) => item.voter.address)
      .filter((value, index, self) => self.indexOf(value) === index);

    // find the unique reveals
    const numberRevealVoters = el.revealedVotes
      .map((item) => item.voter.address)
      .filter((value, index, self) => self.indexOf(value) === index);

    // This entire thing might be very unperformant, but not sure how else to calculate this value.
    let rewardsClaimed = ethers.BigNumber.from("0");
    el.rewardsClaimed.forEach((item) => {
      const reward = ethers.BigNumber.from(item.numTokens);
      rewardsClaimed = rewardsClaimed.add(reward);
    });

    datum.numberCommitVoters = numberCommitVoters.length;
    datum.numberRevealVoters = numberRevealVoters.length;

    // Double check the totalsupply has been indexed to avoid a null error.
    datum.totalSupply =
      el.totalSupplyAtSnapshot !== null
        ? Number(el.totalSupplyAtSnapshot).toFixed(6).toString()
        : "0";
    datum.rewardsClaimed = rewardsClaimed.toString();

    return datum;
  });

  return formattedData;
}
