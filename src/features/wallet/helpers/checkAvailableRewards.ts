import { ethers } from "ethers";
import { VoteRevealed } from "web3/get/queryVotesRevealedEvents";
import { queryRetrieveRewards } from "web3/get/queryRetrieveRewards";

export default async function checkAvailableRewards(
  data: VoteRevealed[],
  address: string,
  contract: ethers.Contract
) {
  const promises = data.map(async (vote) => {
    const rewardAvailable = await queryRetrieveRewards(
      contract,
      address,
      vote.roundId,
      vote.identifier,
      vote.time
    );
    if (rewardAvailable) return parseFloat(rewardAvailable);
  });

  const values = await Promise.all(promises);

  return values.reduce((balance, val) => {
    if (val) return balance ? balance : 0 + val;
    return balance;
  }, 0);
}
