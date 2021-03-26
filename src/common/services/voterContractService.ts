interface VoteDataGql {
  commitedVotes: object[];
  id: string;
  identifier: {
    __typename: string;
    id: string;
  };
  inflationRate: string;
  request: {
    __typename: string;
    price: string;
  };
  revealedVotes: object[];
  rewardsClaimed: object[];
  roundId: string;
  time: string;
  totalSupplyAtSnapshot: string;
  __typename: string;
}

interface FormattedVoteDataGql {}

const voteContractService = {
  formatGqlData: () => {
    //   const newVoteData = {};
    //         // Load data into `newVoteData` synchronously
    //         data.priceRequestRounds.forEach(dataForRequest => {
    //           const identifier = dataForRequest.identifier.id;
    //           const newRoundKey = getRequestKey(dataForRequest.time, identifier, dataForRequest.roundId);
    //           // Commit vote data:
    //           let uniqueVotersCommitted = {};
    //           dataForRequest.committedVotes.forEach(e => {
    //             uniqueVotersCommitted[toChecksumAddress(e.voter.address)] = true;
    //           });
    //           // Revealed vote data:
    //           let totalVotesRevealed = toBN("0");
    //           let correctVotesRevealed = toBN("0");
    //           let pctOfVotesRevealed = toBN("0");
    //           let pctOfCorrectRevealedVotes = toBN("0");
    //           let uniqueVotersRevealed = {};
    //           // If the total supply has not been snapshotted yet, then there will not be revealed
    //           // vote data because the round has not entered the Reveal phase yet
    //           if (dataForRequest.totalSupplyAtSnapshot) {
    //             dataForRequest.revealedVotes.forEach(e => {
    //               totalVotesRevealed = totalVotesRevealed.add(toBN(e.numTokens));
    //               if (e.price === dataForRequest.request.price) {
    //                 correctVotesRevealed = correctVotesRevealed.add(toBN(e.numTokens));
    //               }
    //               uniqueVotersRevealed[toChecksumAddress(e.voter.address)] = true;
    //             });
    //             pctOfVotesRevealed = totalVotesRevealed
    //               .mul(toBN(toWei("1")))
    //               .div(toBN(toWei(dataForRequest.totalSupplyAtSnapshot)));
    //             pctOfCorrectRevealedVotes = correctVotesRevealed.mul(toBN(toWei("1"))).div(totalVotesRevealed);
    //           }
    //           // Rewards claimed data:
    //           let rewardsClaimed = toBN("0");
    //           let rewardsClaimedPct = toBN("0");
    //           let roundInflationRate = toBN("0");
    //           let roundInflationRewardsAvailable = toBN("0");
    //           let uniqueRewardClaimers = {};
    //           // If the inflation rate was not snapshotted yet, then rewards could not have been claimed yet.
    //           if (dataForRequest.inflationRate) {
    //             dataForRequest.rewardsClaimed.forEach(e => {
    //               rewardsClaimed = rewardsClaimed.add(toBN(e.numTokens));
    //               uniqueRewardClaimers[toChecksumAddress(e.claimer.address)] = true;
    //             });
    //             // @dev: `inflationRate` is the inflation % applied each round, so "0.05" means 0.05% or 5 basis points.
    //             roundInflationRate = toBN(toWei(dataForRequest.inflationRate)).div(toBN("100"));
    //             roundInflationRewardsAvailable = roundInflationRate
    //               .mul(toBN(toWei(dataForRequest.totalSupplyAtSnapshot)))
    //               .div(toBN(toWei("1")));
    //             if (!roundInflationRewardsAvailable.isZero()) {
    //               rewardsClaimedPct = rewardsClaimed.mul(toBN(toWei("1"))).div(roundInflationRewardsAvailable);
    //             }
    //           }
    //           // Data on unique users:
    //           const uniqueCommits = Object.keys(uniqueVotersCommitted).length;
    //           const uniqueReveals = Object.keys(uniqueVotersRevealed).length;
    //           const uniqueClaimers = Object.keys(uniqueRewardClaimers).length;
    //           const uniqueRevealsPctOfCommits = uniqueCommits > 0 ? (100 * uniqueReveals) / uniqueCommits : 0;
    //           const uniqueClaimersPctOfReveals = uniqueReveals > 0 ? (100 * uniqueClaimers) / uniqueReveals : 0;
    //           // Insert round data into new object.
    //           newVoteData[newRoundKey] = {
    //             totalSupplyAtSnapshot: dataForRequest.totalSupplyAtSnapshot,
    //             uniqueCommits: uniqueCommits.toString(),
    //             revealedVotes: fromWei(totalVotesRevealed.toString()),
    //             revealedVotesPct: fromWei(pctOfVotesRevealed.mul(toBN("100")).toString()),
    //             uniqueReveals: uniqueReveals.toString(),
    //             uniqueRevealsPctOfCommits: uniqueRevealsPctOfCommits.toString(),
    //             correctVotes: fromWei(correctVotesRevealed.toString()),
    //             correctlyRevealedVotesPct: fromWei(pctOfCorrectRevealedVotes.mul(toBN("100")).toString()),
    //             roundInflationRate: fromWei(roundInflationRate.mul(toBN("100")).toString()),
    //             roundInflationRewardsAvailable: fromWei(roundInflationRewardsAvailable.toString()),
    //             rewardsClaimed: fromWei(rewardsClaimed.toString()),
    //             rewardsClaimedPct: fromWei(rewardsClaimedPct.mul(toBN("100")).toString()),
    //             uniqueClaimers: uniqueClaimers.toString(),
    //             uniqueClaimersPctOfReveals: uniqueClaimersPctOfReveals.toString()
    //           };
    //         });
    //       return newVoteData;
  },
};

export default voteContractService;
