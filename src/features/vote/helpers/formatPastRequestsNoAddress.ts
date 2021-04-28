import { PriceRequestRound } from "common/hooks/useVoteData";
import { PastRequest } from "../PastRequests";
import { DateTime } from "luxon";
import { ethers } from "ethers";

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
      el.request.price !== null ? el.request.price : "0"
    );

    if (el.identifier.id.includes("Admin")) {
      correct = Number(correct) > 0 ? "YES" : "NO";
    }

    console.log("el.request.price", el.request.price);

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

    datum.numberCommitVoters = el.committedVotes.length;
    datum.numberRevealVoters = el.revealedVotes.length;
    datum.totalSupply = el.totalSupplyAtSnapshot;
    return datum;
  });

  return formattedData;
}
