import { useQuery } from "react-query";
import { ethers } from "ethers";
import { queryEncryptedVotes, VoteEvent } from "web3/queryVotingContractEvents";

export default function useEncryptedVotesEvents(
  contract: ethers.Contract | null,
  address: string | null
) {
  const { data } = useQuery<VoteEvent[] | Error>("encryptedVotesEvents", () => {
    return queryEncryptedVotes(contract, address).then((res) => {
      if (res) {
        return res;
      } else {
        return [];
      }
    });
  });

  if (data instanceof Error) return [] as VoteEvent[];

  if (data) {
    return [data];
  } else {
    return [[] as VoteEvent[]];
  }
}
