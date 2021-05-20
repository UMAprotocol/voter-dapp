/** @jsxImportSource @emotion/react */
import { FC, useContext, useState, useEffect } from "react";
import tw from "twin.macro"; // eslint-disable-line

import CommitPhase from "./CommitPhase";
import { useVotePhase, useRound } from "hooks";
import { OnboardContext } from "common/context/OnboardContext";
import { PendingRequest } from "web3/get/queryGetPendingRequests";
import { calculateTimeRemaining } from "./helpers/calculateTimeRemaining";
import { Wrapper } from "./styled/ActiveRequests.styled";
import timerSVG from "assets/icons/timer.svg";
import { EncryptedVote } from "web3/get/queryEncryptedVotesEvents";
import { VoteRevealed } from "web3/get/queryVotesRevealedEvents";
import RevealPhase from "./RevealPhase";
import ActiveViewDetailsModal from "./ActiveViewDetailsModal";
import useModal from "common/hooks/useModal";
import { SigningKeys } from "App";
import { Round } from "web3/get/queryRounds";

export interface ModalState {
  proposal: string;
  timestamp: string;
  ancData: string;
}

interface Props {
  activeRequests: PendingRequest[];
  roundId: string;
  encryptedVotes: EncryptedVote[];
  refetchEncryptedVotes: Function;
  revealedVotes: VoteRevealed[];
  refetchVoteRevealedEvents: Function;
  votingAddress: string | null;
  hotAddress: string | null;
  signingKeys: SigningKeys;
}

const ActiveRequests: FC<Props> = ({
  activeRequests,
  roundId,
  revealedVotes,
  encryptedVotes,
  votingAddress,
  refetchEncryptedVotes,
  hotAddress,
  signingKeys,
  refetchVoteRevealedEvents,
}) => {
  const [timeRemaining, setTimeRemaining] = useState("00:00");

  const [modalState, setModalState] = useState<ModalState>({
    proposal: "",
    timestamp: "",
    ancData: "",
  });

  const { isOpen, open, close, modalRef } = useModal();

  const {
    state: { isConnected },
  } = useContext(OnboardContext);

  const { data: votePhase = "" } = useVotePhase();

  const { data: round = {} as Round } = useRound(Number(roundId));

  // Set time remaining depending if it's the Commit or Reveal
  // Note: the requests are all slightly differently in there final vote time. I'll use the last
  // Vote added.
  useEffect(() => {
    setTimeRemaining(calculateTimeRemaining());

    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 30000);

    return () => clearInterval(timer);
  }, [activeRequests, votePhase]);

  const signingPublicKey =
    hotAddress && signingKeys[hotAddress]
      ? signingKeys[hotAddress].publicKey
      : votingAddress && signingKeys[votingAddress]
      ? signingKeys[votingAddress].publicKey
      : "";

  return (
    <Wrapper className="ActiveRequests">
      <div className="header-row" tw="flex items-stretch p-10">
        <div tw="flex-grow">
          <div className="title">
            Stage: <span>{votePhase ? votePhase : "Snapshot"} Votes</span>
          </div>
          <p className="big-title title">Active Requests</p>
        </div>
        <div tw="flex-grow text-right">
          <div className="title">Time Remaining</div>
          {activeRequests.length ? (
            <div className="time">
              {timeRemaining}
              <span>
                <img src={timerSVG} alt="timer_img" />
              </span>
            </div>
          ) : (
            <div className="time">N/A</div>
          )}
        </div>
      </div>
      {votePhase === "Commit" ? (
        <CommitPhase
          publicKey={signingPublicKey}
          isConnected={isConnected}
          activeRequests={activeRequests}
          encryptedVotes={encryptedVotes}
          refetchEncryptedVotes={refetchEncryptedVotes}
          revealedVotes={revealedVotes}
          votingAddress={votingAddress}
          hotAddress={hotAddress}
          setViewDetailsModalState={setModalState}
          openViewDetailsModal={open}
        />
      ) : null}
      {votePhase === "Reveal" ? (
        <RevealPhase
          isConnected={isConnected}
          encryptedVotes={encryptedVotes}
          activeRequests={activeRequests}
          hotAddress={hotAddress}
          votingAddress={votingAddress}
          round={round}
          revealedVotes={revealedVotes}
          refetchEncryptedVotes={refetchEncryptedVotes}
          refetchVoteRevealedEvents={refetchVoteRevealedEvents}
          setViewDetailsModalState={setModalState}
          openViewDetailsModal={open}
        />
      ) : null}
      <ActiveViewDetailsModal
        isOpen={isOpen}
        close={close}
        ref={modalRef}
        setModalState={setModalState}
        proposal={modalState.proposal}
        timestamp={modalState.timestamp}
        ancData={modalState.ancData}
      />
    </Wrapper>
  );
};

export default ActiveRequests;
