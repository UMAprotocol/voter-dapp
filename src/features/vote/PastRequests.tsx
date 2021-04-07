/** @jsxImportSource @emotion/react */
import { FC, useState, useEffect } from "react";
import tw, { styled } from "twin.macro"; // eslint-disable-line
import { ethers } from "ethers";
import Button from "common/components/button";
import { PriceRequestRound } from "common/hooks/useVoteData";
import {
  formatPastRequestsNoAddress,
  formatPastRequestsByAddress,
} from "./helpers";

export interface PastRequest {
  proposal: string;
  correct: string;
  vote: string;
  reward: string;
  timestamp: string;
  rewardCollected: boolean;
}

interface Props {
  priceRounds: PriceRequestRound[];
  address: string | null;
  contract: ethers.Contract | null;
}

const PastRequests: FC<Props> = ({ priceRounds, address, contract }) => {
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
    <StyledPastRequests className="PastRequests">
      <div className="header-row" tw="flex items-stretch p-10">
        <div tw="flex-grow">
          <p className="big-title title">Past Requests</p>
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
          {pastRequests.length ? (
            pastRequests.map((el, index) => {
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
            })
          ) : (
            <div>Loading...</div>
          )}
        </tbody>
      </table>
      {pastRequests.length && !showAll ? (
        <div className="bottom-row">
          <Button variant="secondary" onClick={() => setShowAll(true)}>
            View All
          </Button>
        </div>
      ) : null}
    </StyledPastRequests>
  );
};

const StyledPastRequests = styled.div`
  &.PastRequests {
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
        background-color: white;
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
  }
`;

export default PastRequests;
