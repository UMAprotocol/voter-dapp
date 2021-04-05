/** @jsxImportSource @emotion/react */
import { FC, useState, useEffect } from "react";
import tw, { styled } from "twin.macro"; // eslint-disable-line
import { DateTime } from "luxon";
import { PriceRound } from "web3/queryVotingContractEvents";
import { ethers } from "ethers";
import Button from "common/components/button";
import {
  VoteEvent,
  RewardsRetrieved,
  PriceResolved,
  VoteRevealed,
} from "web3/queryVotingContractEvents";
import { queryRetrieveRewards } from "web3/queryVotingContractMethods";

import { isPastRequest } from "./helpers";

interface PastRequest {
  proposal: string;
  correct: string;
  vote: string;
  reward: string;
  timestamp: string;
  rewardCollected: boolean;
}

interface Props {
  priceRounds: PriceRound[];
  votesCommitted: VoteEvent[];
  encryptedVotes: VoteEvent[];
  votesRevealed: VoteRevealed[];
  rewardsRetrieved: RewardsRetrieved[];
  priceResolved: PriceResolved[];
  address: string | null;
  contract: ethers.Contract | null;
}

const PastRequests: FC<Props> = ({
  priceRounds,
  // votesCommitted,
  // encryptedVotes,
  votesRevealed,
  rewardsRetrieved,
  priceResolved,
  address,
  contract,
}) => {
  const [pastRequests, setPastRequests] = useState<PastRequest[]>([]);
  const [filteredPastRequests, setFilteredPastRequests] = useState<
    PriceRound[]
  >([]);
  const [showAll, setShowAll] = useState(false);

  // Once priceRounds are pulled from contract, filter them into requests.
  // Show basic price round data when user is not logged into Onboard
  useEffect(() => {
    if (priceRounds.length) {
      console.log("contract>>>>", contract);
      const filterRoundsByTime = priceRounds.filter(isPastRequest).reverse();
      if (!address && filterRoundsByTime.length) {
        const pr = filterRoundsByTime.map((el) => {
          const datum = {} as PastRequest;
          datum.proposal = el.identifier;
          datum.correct = "N/A";
          datum.vote = "N/A";
          datum.reward = "N/A";
          datum.rewardCollected = true;
          datum.timestamp = DateTime.fromSeconds(
            Number(el.time)
          ).toLocaleString();
          return datum;
        });
        setPastRequests(pr);
      }

      // When address is defined, user is logged in.
      if (address && filterRoundsByTime.length) {
        const pr = filterRoundsByTime.map((el) => {
          // Determine correct vote
          let correct = "N/A";
          const findPriceResolved = priceResolved.find(
            (x) => x.identifier === el.identifier
          );
          console.log("findPriceResolved", findPriceResolved);
          if (findPriceResolved) {
            if (el.identifier.includes("Admin")) {
              correct = Number(findPriceResolved.price) > 0 ? "YES" : "NO";
            } else {
              correct = findPriceResolved.price;
            }
          }

          let vote = "N/A";
          const findVote = votesRevealed.find(
            (x) => x.identifier === el.identifier
          );
          // if the name of the proposal includes "Admin", it is a true/false vote.
          if (findVote) {
            if (el.identifier.includes("Admin")) {
              vote = Number(findVote.price) > 0 ? "YES" : "NO";
            } else {
              console.log("findVote Price", findVote.price);
              // vote = ethers.utils.formatEther(findVote.price);
              vote = findVote.price;
            }
          }

          // Note: Rewards can be retrieved from the event after the user has
          // taken it. If they haven't, you must do a getPrice call to the contract from Governor address.
          let reward = "N/A";
          const findReward = rewardsRetrieved.find(
            (x) => el.identifier === x.identifier && el.roundId === x.roundId
          );
          if (contract) {
            console.log(contract.functions);
          }

          if (findReward) {
            reward = ethers.utils.formatEther(findReward.numTokens);
          } else {
            console.log("Need to query blockchain meow.");
            if (contract) {
              queryRetrieveRewards(contract, address, el.roundId);
            }
          }

          // Determine if the user has revealed a vote and has not retrieved their rewards yet.
          let rewardCollected = true;
          if (!findReward && findVote) {
            rewardCollected = false;
          }

          const datum = {} as PastRequest;
          datum.proposal = el.identifier;
          datum.correct = correct;
          datum.vote = vote;
          datum.reward = reward;
          datum.rewardCollected = rewardCollected;
          datum.timestamp = DateTime.fromSeconds(
            Number(el.time)
          ).toLocaleString({
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h24",
            timeZoneName: "short",
          });

          return datum;
        });
        setPastRequests(pr);
      }
    }
  }, [priceRounds, address, setPastRequests, votesRevealed]);

  return (
    <StyledPastRequests>
      <div className="header-row" tw="flex items-stretch p-10">
        <div tw="flex-grow">
          <p className="big-title">Past Requests</p>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Proposal</th>
            <th>Correct Vote</th>
            <th>Your Vote</th>
            <th>Earned Rewards</th>
            <th>Timestamp</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pastRequests.map((el, index) => {
            return (
              <tr key={index}>
                <td>
                  <div className="identifier">{el.proposal}</div>
                </td>
                <td>
                  <div>{el.correct}</div>
                </td>
                <td>
                  <div>{el.vote}</div>
                </td>
                <td>
                  <div>{el.reward}</div>
                </td>
                <td>
                  <div>{el.timestamp}</div>
                </td>
                {el.vote === el.correct && el.vote !== "N/A" ? (
                  <td>
                    <div>
                      <Button disabled={el.rewardCollected} variant="primary">
                        {!el.rewardCollected && el.vote === el.correct
                          ? "Collect Reward"
                          : "Collected"}
                      </Button>
                    </div>
                  </td>
                ) : (
                  <td>
                    <div />
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      {pastRequests.length ? (
        <div className="bottom-row">
          <Button variant="primary" onClick={() => setShowAll(true)}>
            View All
          </Button>
        </div>
      ) : null}
    </StyledPastRequests>
  );
};

const StyledPastRequests = styled.div`
  font-family: "Halyard Display";
  background-color: #fff;
  ${tw`max-w-7xl mx-auto py-5 my-10 mb-10`};

  .header-row {
    max-width: 1350px;
    margin: 0 auto;
    padding-bottom: 2rem;
    .big-title {
      font-size: 2.5rem;
      font-weight: 600;
      line-height: 1.38;
    }
  }
  .table {
    ${tw`table-auto p-10`};
    width: 100%;
    max-width: 1250px;
    margin: 0 auto;
    border-collapse: separate;
    border-spacing: 0 15px;

    thead {
      tr {
        text-align: left;
        margin-bottom: 2rem;
      }
      th {
        padding-bottom: 1rem;
        border-bottom: 1px solid #e5e5e5;
      }
      th:last-child {
        text-align: center;
      }
    }

    tbody {
      td {
        /* &:last-child div {
          padding-bottom: 2rem;
        } */
        div {
          display: flex;
          align-items: center;
          border-bottom: 1px solid #e5e5e5;
          padding: 0.5rem;
          padding-bottom: 3rem;
          min-height: 125px;
        }
        .description {
          max-width: 500px;
        }
      }
      td:first-of-type {
        /* div {

      }
      max-width: 150px; */
      }

      td:last-child {
        svg {
          margin: 0 auto;
        }
      }
    }
  }
  .bottom-row {
    text-align: center;
    button {
      width: 150px;
    }
  }
`;

export default PastRequests;
