import { ethers } from "ethers";
import { VoteRevealed } from "common/web3/get/queryVotesRevealedEvents";
import { queryRetrieveRewards } from "common/web3/get/queryRetrieveRewards";

export default async function checkAvailableRewards(
  data: VoteRevealed[],
  address: string,
  contract: ethers.Contract
) {
  const promises = data.map(async (vote) => {
    try {
      const rewardAvailable = await queryRetrieveRewards(
        contract,
        address,
        vote.roundId,
        vote.identifier,
        vote.time,
        vote.ancillaryData
      );
      if (rewardAvailable) return parseFloat(rewardAvailable);
    } catch (err) {
      console.log("err: reward collected.", err);
    }
  });

  const values = await Promise.all(promises);

  return values.reduce((balance, val) => {
    if (val) return (balance ? balance : 0) + val;
    return balance;
  }, 0);
}
