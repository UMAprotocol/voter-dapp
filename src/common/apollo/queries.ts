import { gql } from "@apollo/client";

export const PRICE_REQUEST_VOTING_DATA = gql`
  query priceRequestRounds(
    $orderBy: String
    $orderDirection: String
    $numToQuery: Int
  ) {
    priceRequestRounds(first: 10) {
      id
      identifier {
        id
      }
      roundId
      time
      totalSupplyAtSnapshot
      committedVotes {
        voter {
          address
        }
      }
      revealedVotes {
        numTokens
        price
        voter {
          address
        }
      }
      inflationRate
      rewardsClaimed {
        numTokens
        claimer {
          address
        }
      }
      request {
        price
      }
    }
  }
`;
