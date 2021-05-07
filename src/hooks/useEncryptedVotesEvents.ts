import { useQuery } from "react-query";
import { ethers } from "ethers";
import {
  queryEncryptedVotes,
  EncryptedVote,
} from "web3/get/queryEncryptedVotesEvents";

export default function useEncryptedVotesEvents(
  contract: ethers.Contract | null,
  address: string | null,
  privateKey: string,
  roundId: string
) {
  const { data, error, isFetching, refetch } = useQuery<EncryptedVote[]>(
    "encryptedVotesEvents",
    () => {
      return queryEncryptedVotes(
        contract,
        privateKey,
        address,
        roundId
        // hotAddress
      ).then((res) => {
        if (res) {
          return res;
        } else {
          return [];
        }
      });
    },
    { enabled: contract !== null && privateKey !== "" }
  );

  if (data) {
    return { data, error, isFetching, refetch };
  } else {
    return { data: [] as EncryptedVote[], error, isFetching, refetch };
  }
}
