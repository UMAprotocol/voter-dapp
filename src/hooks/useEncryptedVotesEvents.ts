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
  roundId: string,
  addError: (message: string) => void
) {
  const { data, error, isFetching, refetch } = useQuery<EncryptedVote[]>(
    // key encryped votes by connected address
    ["encryptedVotesEvents", address],
    () => {
      return queryEncryptedVotes(
        contract,
        privateKey,
        address,
        roundId
        // hotAddress
      )
        .then((res) => {
          if (res) {
            return res;
          } else {
            return [];
          }
        })
        .catch((err) => {
          addError(`${err.message}`);
          return [] as EncryptedVote[];
        });
    },
    {
      // do not run query if any of these are null
      enabled: contract !== null && privateKey !== "" && address != null,
    }
  );

  if (data) {
    return { data, error, isFetching, refetch };
  } else {
    return { data: [] as EncryptedVote[], error, isFetching, refetch };
  }
}
