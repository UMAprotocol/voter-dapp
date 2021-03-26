import { useState, useEffect, useCallback } from "react";

import { useQuery } from "@apollo/client";
import { PRICE_REQUEST_VOTING_DATA } from "../apollo/queries";

// const getRequestKey = (time, identifier, roundId) => {
//   return identifier + "-" + time + "-" + roundId;
// };

// Retrieve vote data per price request from graphQL API.
function useVoteData() {
  // const { toBN, fromWei, toWei, toChecksumAddress } = web3.utils;
  const [roundVoteData, setRoundVoteData] = useState({});

  // Because apollo caches results of queries, we will poll/refresh this query periodically.
  // We set the poll interval to a very slow 5 seconds for now since the vote states
  // are not expected to change much.
  // Source: https://www.apollographql.com/docs/react/data/queries/#polling
  const { loading, error, data } = useQuery(PRICE_REQUEST_VOTING_DATA, {
    pollInterval: 60000,
  });

  const getVoteStats = useCallback(() => {
    if (error) {
      console.error("Failed to get data:", error);
    }
    if (!loading && data) {
      console.log("data", data);
      // const newVoteData = formatData(data);
      // setRoundVoteData(newVoteData);
    }
  }, [data, error, loading]);

  // Refresh the object every time the graphQL API response changes
  useEffect(() => {
    getVoteStats();
  }, [loading, error, data, getVoteStats]);

  return {
    roundVoteData,
    // getRequestKey
  };
}

export default useVoteData;
