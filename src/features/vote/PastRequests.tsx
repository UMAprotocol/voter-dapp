/** @jsxImportSource @emotion/react */
import { FC, useState, useEffect } from "react";
import tw, { styled } from "twin.macro"; // eslint-disable-line
import { ethers } from "ethers";
import Button from "common/components/button";
import { PriceRequestRound } from "common/hooks/useVoteData";
import { formatPastRequestsNoAddress } from "./helpers/formatPastRequestsNoAddress";
import { formatPastRequestsByAddress } from "./helpers/formatPastRequestByAddress";
import RequestsWrapper from "./styled/RequestsWrapper";

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
      <div className="requests-header-row">
        <div>
          <p className="requests-title-lg title">Past Requests</p>
        </div>
      </div>
      {pastRequests.length ? (
        <table className="requests-table">
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
      ) : (
        <div className="loading">Loading...</div>
      )}

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

const StyledPastRequests = styled(RequestsWrapper)`
  &.PastRequests {
  }
`;

export default PastRequests;
