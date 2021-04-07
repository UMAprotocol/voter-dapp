import { useQuery } from "react-query";
import { ethers } from "ethers";
import { queryEncryptedVotes, VoteEvent } from "web3/queryVotingContractEvents";

export default function useEncryptedVotesEvents(
  contract: ethers.Contract | null,
  address: string | null
) {
  const { data, error, isFetching } = useQuery<VoteEvent[]>(
    "encryptedVotesEvents",
    () => {
      return queryEncryptedVotes(contract, address).then((res) => {
        if (res) {
          return res;
        } else {
          return [];
        }
      });
    },
    { enabled: contract !== null }
  );

  if (data) {
    return { data, error, isFetching };
  } else {
    return { data: [] as VoteEvent[], error, isFetching };
  }
}
