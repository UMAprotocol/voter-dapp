import { useContext } from "react";
import { useQuery } from "react-query";
import { ethers } from "ethers";
import {
  queryEncryptedVotes,
  EncryptedVote,
} from "web3/get/queryEncryptedVotesEvents";
import { ErrorContext } from "common/context/ErrorContext";
import usePrevious from "common/hooks/usePrevious";

export default function useEncryptedVotesEvents(
  contract: ethers.Contract | null,
  address: string | null,
  privateKey: string,
  roundId: string
) {
  const { addError } = useContext(ErrorContext);

  const previousAddress = usePrevious(address);
  // To prevent a "bad MAC" error, try not to run the query if the previousAddress is defined but it doesn't equal current address.
  // This happens because the wallet state is async -- sometimes when disconnecting, address is defined before we change the state.
  const addressCheck = !(
    previousAddress !== null && previousAddress !== address
  );
  const { data, error, isFetching, refetch } = useQuery<
    EncryptedVote[] | undefined | void
  >(
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
        .then((res) => res)
        .catch((err) => addError(err));
    },
    {
      // do not run query if any of these are null
      enabled:
        contract !== null &&
        privateKey !== "" &&
        address != null &&
        roundId !== "" &&
        addressCheck,
    }
  );

  return { data, error, isFetching, refetch };
}
