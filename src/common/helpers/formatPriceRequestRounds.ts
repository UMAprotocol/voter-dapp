import { BigNumber, utils } from "ethers";
import { PriceRequestRounds } from "common/hooks/useVoteData";
import formatRequestKey from "./formatRequestKey";
import toWei from "common/utils/convertToWeiSafely";

interface FormattedVoteDataGql {}

const fromWei = utils.formatUnits;

export default function formatPriceRequestRounds(data: PriceRequestRounds[]) {
  const newVoteData = {};
  // Load data into `newVoteData` synchronously
  data.forEach((rr) => {
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

    // // Rewards claimed data:
    // let rewardsClaimed = toBN("0");
    // let rewardsClaimedPct = toBN("0");
    // let roundInflationRate = toBN("0");
    // let roundInflationRewardsAvailable = toBN("0");
    // let uniqueRewardClaimers = {};
    // // If the inflation rate was not snapshotted yet, then rewards could not have been claimed yet.
    // if (dataForRequest.inflationRate) {
    //   dataForRequest.rewardsClaimed.forEach((e) => {
    //     rewardsClaimed = rewardsClaimed.add(toBN(e.numTokens));
    //     uniqueRewardClaimers[toChecksumAddress(e.claimer.address)] = true;
    //   });
    //   // @dev: `inflationRate` is the inflation % applied each round, so "0.05" means 0.05% or 5 basis points.
    //   roundInflationRate = toBN(toWei(dataForRequest.inflationRate)).div(
    //     toBN("100")
    //   );
    //   roundInflationRewardsAvailable = roundInflationRate
    //     .mul(toBN(toWei(dataForRequest.totalSupplyAtSnapshot)))
    //     .div(toBN(toWei("1")));
    //   if (!roundInflationRewardsAvailable.isZero()) {
    //     rewardsClaimedPct = rewardsClaimed
    //       .mul(toBN(toWei("1")))
    //       .div(roundInflationRewardsAvailable);
    //   }
    // }
    // // Data on unique users:
    // const uniqueCommits = Object.keys(uniqueVotersCommitted).length;
    // const uniqueReveals = Object.keys(uniqueVotersRevealed).length;
    // const uniqueClaimers = Object.keys(uniqueRewardClaimers).length;
    // const uniqueRevealsPctOfCommits =
    //   uniqueCommits > 0 ? (100 * uniqueReveals) / uniqueCommits : 0;
    // const uniqueClaimersPctOfReveals =
    //   uniqueReveals > 0 ? (100 * uniqueClaimers) / uniqueReveals : 0;
    // // Insert round data into new object.
    // newVoteData[newRoundKey] = {
    //   totalSupplyAtSnapshot: dataForRequest.totalSupplyAtSnapshot,
    //   uniqueCommits: uniqueCommits.toString(),
    //   revealedVotes: fromWei(totalVotesRevealed.toString()),
    //   revealedVotesPct: fromWei(pctOfVotesRevealed.mul(toBN("100")).toString()),
    //   uniqueReveals: uniqueReveals.toString(),
    //   uniqueRevealsPctOfCommits: uniqueRevealsPctOfCommits.toString(),
    //   correctVotes: fromWei(correctVotesRevealed.toString()),
    //   correctlyRevealedVotesPct: fromWei(
    //     pctOfCorrectRevealedVotes.mul(toBN("100")).toString()
    //   ),
    //   roundInflationRate: fromWei(
    //     roundInflationRate.mul(toBN("100")).toString()
    //   ),
    //   roundInflationRewardsAvailable: fromWei(
    //     roundInflationRewardsAvailable.toString()
    //   ),
    //   rewardsClaimed: fromWei(rewardsClaimed.toString()),
    //   rewardsClaimedPct: fromWei(rewardsClaimedPct.mul(toBN("100")).toString()),
    //   uniqueClaimers: uniqueClaimers.toString(),
    //   uniqueClaimersPctOfReveals: uniqueClaimersPctOfReveals.toString(),
    // };
  });
  return newVoteData;
}
