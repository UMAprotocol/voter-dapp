import { useState, useEffect } from "react";

import { useQuery } from "@apollo/client";
import { PRICE_REQUEST_VOTING_DATA } from "../apollo/queries";
import formatPriceRequestVoteData, {
  FormattedPriceRequestRounds,
} from "common/helpers/formatPriceRequestVoteData";

// These do interfaces come with __typenames, but I figure this probably ignorable for our purposes
interface Voter {
  voter: {
    address: string;
  };
}

interface RevealedVotes {
  numTokens: string;
  price: string;
  voter: {
    address: string;
  };
}

interface RewardsClaimed {
  numTokens: string;
  claimer: {
    address: string;
  };
}

export interface PriceRequestRound {
  committedVotes: Voter[];
  id: string;
  identifier: {
    id: string;
  };
  inflationRate: string;
  request: {
    price: string;
  };
  revealedVotes: RevealedVotes[];
  rewardsClaimed: RewardsClaimed[];
  roundId: string;
  time: string;
  totalSupplyAtSnapshot: string;
}

const POLLING_INTERVAL = 60000;

// Retrieve vote data per price request from graphQL API.
// Taken from previous voter-dapp, with heavy refactoring.
function useVoteData() {
  const [votingSummaryData, setVotingSummaryData] =
    useState<FormattedPriceRequestRounds>({});

  // Because apollo caches results of queries, we will poll/refresh this query periodically.
  // We set the poll interval to a very slow 60 seconds for now since the vote states
  // are not expected to change much.
  // Source: https://www.apollographql.com/docs/react/data/queries/#polling
  const { loading, error, data, refetch } = useQuery<{
    priceRequestRounds: PriceRequestRound[];
  }>(PRICE_REQUEST_VOTING_DATA, {
    variables: {
      orderBy: "time",
      orderDirection: "desc",
    },
    pollInterval: POLLING_INTERVAL,
  });

  // Refresh the object every time the graphQL API response changes
  useEffect(() => {
    if (error) {
      console.error("Failed to get data:", error);
    }

    if (!loading && data) {
      const newVoteSummaryData = formatPriceRequestVoteData(
        data.priceRequestRounds
      );
      setVotingSummaryData(newVoteSummaryData);
    }
  }, [loading, error, data]);

  return {
    votingSummaryData,
    data: data?.priceRequestRounds,
    refetch,
  };
}

export default useVoteData;
