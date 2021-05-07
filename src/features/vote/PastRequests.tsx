/** @jsxImportSource @emotion/react */
import { FC, useState, useEffect } from "react";
import { ethers } from "ethers";
import Button from "common/components/button";
import { PriceRequestRound } from "common/hooks/useVoteData";
import { formatPastRequestsNoAddress } from "./helpers/formatPastRequestsNoAddress";
import { formatPastRequestsByAddress } from "./helpers/formatPastRequestByAddress";
import { Wrapper } from "./styled/PastRequests.styled";
import useModal from "common/hooks/useModal";
import PastViewDetailsModal from "./PastViewDetailsModal";

export interface ModalState {
  proposal: string;
  correct: string;
  totalSupply: string;
  numberCommitVoters: number;
  numberRevealVoters: number;
  timestamp: string;
  rewardsClaimed: string;
}

export interface PastRequest {
  proposal: string;
  correct: string;
  vote: string;
  reward: string;
  timestamp: string;
  totalSupply: string;
  numberCommitVoters: number;
  numberRevealVoters: number;
  rewardsClaimed: string;
}

interface Props {
  voteSummaryData: PriceRequestRound[];
  address: string | null;
  contract: ethers.Contract | null;
  roundId: string;
}

const PastRequests: FC<Props> = ({
  voteSummaryData,
  address,
  contract,
  roundId,
}) => {
  const [pastRequests, setPastRequests] = useState<PastRequest[]>([]);
  const [showAll, setShowAll] = useState(false);

  const { isOpen, open, close, modalRef } = useModal();
  const [modalState, setModalState] = useState<ModalState>({
    proposal: "",
    correct: "",
    totalSupply: "",
    numberCommitVoters: 0,
    numberRevealVoters: 0,
    timestamp: "",
    rewardsClaimed: "0",
  });

  useEffect(() => {
    // Handle past requests differently depending on if user is logged in or not.
    if (voteSummaryData.length && roundId) {
      const filteredByRound = voteSummaryData.filter(
        (el) => Number(el.roundId) < Number(roundId)
      );

      if (address && contract) {
        const pr = formatPastRequestsByAddress(filteredByRound, address);
        Promise.all(pr).then((res) => {
          setPastRequests(!showAll ? res.slice(0, 10) : res);
        });
        console.log("pr", pr);
      } else {
        const pr = formatPastRequestsNoAddress(filteredByRound);

        setPastRequests(!showAll ? pr.slice(0, 10) : pr);
      }
    }
  }, [voteSummaryData, address, contract, showAll, roundId]);

  return (
    <Wrapper className="PastRequests">
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
            </tr>
          </thead>
          <tbody>
            {pastRequests.map((el, index) => {
              return (
                <tr key={index}>
                  <td>
                    <div className="identifier">
                      <p>{el.proposal}</p>
                      <p
                        onClick={() => {
                          console.log("el", el);
                          open();
                          setModalState({
                            proposal: el.proposal,
                            correct: el.correct,
                            totalSupply: el.totalSupply,
                            numberCommitVoters: el.numberCommitVoters,
                            numberRevealVoters: el.numberRevealVoters,
                            timestamp: el.timestamp,
                            rewardsClaimed:
                              el.reward !== "N/A" ? el.reward : "0",
                          });
                        }}
                        className="PastRequests-view-details"
                      >
                        View Details
                      </p>
                    </div>
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
      <PastViewDetailsModal
        isOpen={isOpen}
        close={close}
        ref={modalRef}
        proposal={modalState.proposal}
        totalSupply={
          // Null check in case this value is displayed for before snapshot indexed on thegraph
          modalState.totalSupply !== "0"
            ? ethers.utils.commify(modalState.totalSupply)
            : "0"
        }
        correct={modalState.correct}
        setModalState={setModalState}
        numberCommitVoters={modalState.numberCommitVoters}
        numberRevealVoters={modalState.numberRevealVoters}
        timestamp={modalState.timestamp}
        rewardsClaimed={modalState.rewardsClaimed}
      />
    </Wrapper>
  );
};

export default PastRequests;
