import { gql } from "@apollo/client";

/* 

{
  priceRequestRounds {
    totalSupplyAtSnapshot
    inflationRate
    winnerGroup {
      totalVoteAmount
        votes {
         voter {
          address
        }
        numTokens
      }
    }
  }
}

Summary: you can look up each round’s inflation percentage (inflationRate) and multiply inflationRate * totalSupplyAtSnapshot = totalRewards to get total rewards up for grabs.

ext, grab all voters who voted correctly via the winnerGroup and figure out their share of the total rewards: voter.numTokens / totalVoteAmount * 1e18 = voterShareOfRewards

Voter rewards is then voterShareOfRewards * totalRewards

Doable, but increases the complexity of completing this.
*/
export const PRICE_REQUEST_VOTING_DATA = gql`
  query priceRequestRounds(
    $orderBy: String
    $orderDirection: String
    $numToQuery: Int
  ) {
    priceRequestRounds(
      first: $numToQuery
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      ancillaryData
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
      winnerGroup {
        totalVoteAmount
        votes {
          numTokens
          voter {
            address
          }
        }
      }
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
