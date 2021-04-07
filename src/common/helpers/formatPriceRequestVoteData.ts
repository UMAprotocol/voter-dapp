import { BigNumber, utils } from "ethers";
import { PriceRequestRound } from "common/hooks/useVoteData";
import formatRequestKey from "./formatRequestKey";
import toWei from "common/utils/web3/convertToWeiSafely";
import { DateTime } from "luxon";

export interface FormattedPriceRequestRounds {
  [key: string]: {
    totalSupplyAtSnapshot: string;
    uniqueCommits: string;
    revealedVotes: string;
    revealedVotesPct: string;
    uniqueReveals: string;
    uniqueRevealsPctOfCommits: string;
    correctVotes: string;
    correctlyRevealedVotesPct: string;
    roundInflationRate: string;
    roundInflationRewardsAvailable: string;
    rewardsClaimed: string;
    rewardsClaimedPct: string;
    uniqueClaimers: string;
    uniqueClaimersPctOfReveals: string;
    time: number;
  };
}

const fromWei = utils.formatUnits;

export function formatPriceRoundTime(time: number) {
  return `${DateTime.fromSeconds(Number(time)).toLocaleString({
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })} ${DateTime.local().toFormat("ZZZZ")}`;
}

// Taken from previous voter dapp, refactored to use TypeScript and Ethers.
export default function formatPriceRequestVoteData(
  data: PriceRequestRound[]
): FormattedPriceRequestRounds {
  const formattedPriceRequestRounds: FormattedPriceRequestRounds = {};
  // Load data into `newVoteData` synchronously
  data.forEach((rr: PriceRequestRound) => {
    const identifier = rr.identifier.id;
    const newRoundKey = formatRequestKey(rr.time, identifier, rr.roundId);
    // Commit vote data:
    let uniqueVotersCommitted: {
      [key: string]: boolean;
    } = {};

    rr.committedVotes.forEach((e) => {
      uniqueVotersCommitted[
        utils.getAddress(e.voter.address.toLowerCase())
      ] = true;
    });

    // Revealed vote data:
    let totalVotesRevealed = BigNumber.from("0");
    let correctVotesRevealed = BigNumber.from("0");
    let pctOfVotesRevealed = BigNumber.from("0");
    let pctOfCorrectRevealedVotes = BigNumber.from("0");
    let uniqueVotersRevealed: {
      [key: string]: boolean;
    } = {};

    // If the total supply has not been snapshotted yet, then there will not be revealed
    // vote data because the round has not entered the Reveal phase yet
    if (rr.totalSupplyAtSnapshot) {
      rr.revealedVotes.forEach((e) => {
        totalVotesRevealed = totalVotesRevealed.add(
          BigNumber.from(e.numTokens)
        );
        if (e.price === rr.request.price) {
          correctVotesRevealed = correctVotesRevealed.add(
            BigNumber.from(e.numTokens)
          );
        }
        uniqueVotersRevealed[utils.getAddress(e.voter.address)] = true;
      });
      pctOfVotesRevealed = totalVotesRevealed
        .mul(BigNumber.from(toWei("1")))
        .div(BigNumber.from(toWei(rr.totalSupplyAtSnapshot)));
      pctOfCorrectRevealedVotes = correctVotesRevealed
        .mul(BigNumber.from(toWei("1")))
        .div(totalVotesRevealed);
    }

    // Rewards claimed data:
    let rewardsClaimed = BigNumber.from("0");
    let rewardsClaimedPct = BigNumber.from("0");
    let roundInflationRate = BigNumber.from("0");
    let roundInflationRewardsAvailable = BigNumber.from("0");
    let uniqueRewardClaimers: {
      [key: string]: boolean;
    } = {};

    // If the inflation rate was not snapshotted yet, then rewards could not have been claimed yet.
    if (rr.inflationRate) {
      rr.rewardsClaimed.forEach((e) => {
        rewardsClaimed = rewardsClaimed.add(BigNumber.from(e.numTokens));
        uniqueRewardClaimers[
          utils.getAddress(e.claimer.address.toLowerCase())
        ] = true;
      });
      // @dev: `inflationRate` is the inflation % applied each round, so "0.05" means 0.05% or 5 basis points.
      roundInflationRate = BigNumber.from(toWei(rr.inflationRate)).div(
        BigNumber.from("100")
      );
      roundInflationRewardsAvailable = roundInflationRate
        .mul(BigNumber.from(toWei(rr.totalSupplyAtSnapshot)))
        .div(BigNumber.from(toWei("1")));
      if (!roundInflationRewardsAvailable.isZero()) {
        rewardsClaimedPct = rewardsClaimed
          .mul(BigNumber.from(toWei("1")))
          .div(roundInflationRewardsAvailable);
      }
    }
    // Data on unique users:
    const uniqueCommits = Object.keys(uniqueVotersCommitted).length;
    const uniqueReveals = Object.keys(uniqueVotersRevealed).length;
    const uniqueClaimers = Object.keys(uniqueRewardClaimers).length;
    const uniqueRevealsPctOfCommits =
      uniqueCommits > 0 ? (100 * uniqueReveals) / uniqueCommits : 0;
    const uniqueClaimersPctOfReveals =
      uniqueReveals > 0 ? (100 * uniqueClaimers) / uniqueReveals : 0;
    // Insert round data into new object.
    formattedPriceRequestRounds[newRoundKey] = {
      totalSupplyAtSnapshot: rr.totalSupplyAtSnapshot,
      uniqueCommits: uniqueCommits.toString(),
      revealedVotes: fromWei(totalVotesRevealed.toString()),
      revealedVotesPct: fromWei(
        pctOfVotesRevealed.mul(BigNumber.from("100")).toString()
      ),
      uniqueReveals: uniqueReveals.toString(),
      uniqueRevealsPctOfCommits: uniqueRevealsPctOfCommits.toString(),
      correctVotes: fromWei(correctVotesRevealed.toString()),
      correctlyRevealedVotesPct: fromWei(
        pctOfCorrectRevealedVotes.mul(BigNumber.from("100")).toString()
      ),
      roundInflationRate: fromWei(
        roundInflationRate.mul(BigNumber.from("100")).toString()
      ),
      roundInflationRewardsAvailable: fromWei(
        roundInflationRewardsAvailable.toString()
      ),
      rewardsClaimed: fromWei(rewardsClaimed.toString()),
      rewardsClaimedPct: fromWei(
        rewardsClaimedPct.mul(BigNumber.from("100")).toString()
      ),
      uniqueClaimers: uniqueClaimers.toString(),
      uniqueClaimersPctOfReveals: uniqueClaimersPctOfReveals.toString(),
      time: Number(rr.time),
    };
  });

  return formattedPriceRequestRounds;
}
