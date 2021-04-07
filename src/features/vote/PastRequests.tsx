/** @jsxImportSource @emotion/react */
import { FC, useState, useEffect } from "react";
import tw, { styled } from "twin.macro"; // eslint-disable-line
import { DateTime } from "luxon";
import { ethers } from "ethers";
import Button from "common/components/button";
import {
  VoteEvent,
  RewardsRetrieved,
  PriceResolved,
  VoteRevealed,
} from "web3/queryVotingContractEvents";
import { PriceRequestRound } from "common/hooks/useVoteData";

import { queryRetrieveRewards } from "web3/queryVotingContractMethods";

interface PastRequest {
  proposal: string;
  correct: string;
  vote: string;
  reward: string;
  timestamp: string;
  rewardCollected: boolean;
}

interface Props {
  priceRounds: PriceRequestRound[];
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
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    // Handle past requests differently depending on if user is logged in or not.
    if (priceRounds.length) {
      if (address && contract) {
        const pr = formatPastRequestsByAddress(priceRounds, address, contract);
        Promise.all(pr).then((res) => {
          setPastRequests(!showAll ? res.slice(0, 10) : res);
        });
      } else {
        const pr = formatPastRequestsNoAddress(priceRounds);

        setPastRequests(!showAll ? pr.slice(0, 10) : pr);
      }
    }
  }, [priceRounds, address, contract, showAll]);

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
                      <Button
                        variant={
                          !el.rewardCollected &&
                          el.vote === el.correct &&
                          el.reward !== "0"
                            ? "primary"
                            : "disabled"
                        }
                      >
                        {!el.rewardCollected &&
                        el.vote === el.correct &&
                        el.reward !== "0"
                          ? "Collect Reward"
                          : el.reward === "0"
                          ? "Expired"
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
          <Button variant="secondary" onClick={() => setShowAll(true)}>
            View All
          </Button>
        </div>
      ) : null}
    </StyledPastRequests>
  );
};

// Sorts and sets some default values for when the user isn't logged in.
function formatPastRequestsNoAddress(data: PriceRequestRound[]) {
  const sortedByTime = data.slice().sort((a, b) => {
    if (Number(b.time) > Number(a.time)) return 1;
    if (Number(b.time) < Number(a.time)) return -1;
    return 0;
  });

  const formattedData = sortedByTime.map((el) => {
    const datum = {} as PastRequest;
    datum.proposal = el.identifier.id;
    datum.correct = "N/A";
    datum.vote = "N/A";
    datum.reward = "N/A";
    datum.rewardCollected = true;
    datum.timestamp = DateTime.fromSeconds(Number(el.time)).toLocaleString({
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

  return formattedData;
}

//
function formatPastRequestsByAddress(
  data: PriceRequestRound[],
  address: string,
  contract: ethers.Contract | null
) {
  const sortedByTime = data.slice().sort((a, b) => {
    if (Number(b.time) > Number(a.time)) return 1;
    if (Number(b.time) < Number(a.time)) return -1;
    return 0;
  });
  const formattedData = sortedByTime.map(async (el, index) => {
    // Determine correct vote
    let correct = ethers.utils.formatEther(el.request.price);
    if (el.identifier.id.includes("Admin")) {
      correct = Number(correct) > 0 ? "YES" : "NO";
    }

    let vote = "N/A";
    const findVote = el.revealedVotes.find(
      (x) => x.voter.address.toLowerCase() === address.toLowerCase()
    );
    // if the name of the proposal includes "Admin", it is a true/false vote.
    if (findVote) {
      if (el.identifier.id.includes("Admin")) {
        vote = Number(findVote.price) > 0 ? "YES" : "NO";
      } else {
        vote = ethers.utils.formatEther(findVote.price);
      }
    }

    // Note: Rewards can be retrieved from the event after the user has
    // taken it. If they haven't, you must do a getPrice call to the contract from Governor address.
    let reward = "N/A";
    const findReward = el.rewardsClaimed.find(
      (x) => x.claimer.address.toLowerCase() === address.toLowerCase()
    );

    if (findReward) {
      reward = ethers.utils.formatEther(findReward.numTokens);
    } else {
      if (contract && findVote) {
        const checkIfRewardAvailable = await queryRetrieveRewards(
          contract,
          address,
          el.roundId,
          el.identifier.id,
          el.time
        );
        if (checkIfRewardAvailable) reward = checkIfRewardAvailable;
      }
    }

    // Determine if the user has revealed a vote and has not retrieved their rewards yet.
    let rewardCollected = true;
    if (!findReward && findVote) {
      rewardCollected = false;
    }

    const datum = {} as PastRequest;
    datum.proposal = el.identifier.id;
    datum.correct = correct;
    datum.vote = vote;
    datum.reward = reward;
    datum.rewardCollected = rewardCollected;
    datum.timestamp = DateTime.fromSeconds(Number(el.time)).toLocaleString({
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
  return formattedData;
}

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
