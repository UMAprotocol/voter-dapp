import { DateTime } from "luxon";
import { PriceRound } from "web3/queryVotingContractEvents";

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
