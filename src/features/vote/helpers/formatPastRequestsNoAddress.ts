import { PriceRequestRound } from "common/hooks/useVoteData";
import { PastRequest } from "../PastRequests";
import { DateTime } from "luxon";

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
