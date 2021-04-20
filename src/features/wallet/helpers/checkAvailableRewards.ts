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

  return Promise.all(promises).then((values) => {
    let balance = 0;
    values.map((val) => {
      if (val && val) return (balance += val);
      return false;
    });

    return balance;
  });
}
