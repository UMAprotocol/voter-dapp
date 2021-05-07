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

interface Props {
  publicKey: string;
  privateKey: string;
  activeRequests: PendingRequest[];
  roundId: string;
  encryptedVotes: EncryptedVote[];
  refetchEncryptedVotes: Function;
  revealedVotes: VoteRevealed[];
  votingAddress: string | null;
  hotAddress: string | null;
}

interface Timer {
  hours: string;
  minutes: string;
}

const ActiveRequests: FC<Props> = ({
  publicKey,
  activeRequests,
  roundId,
  revealedVotes,
  encryptedVotes,
  votingAddress,
  refetchEncryptedVotes,
  hotAddress,
}) => {
  const [timeRemaining, setTimeRemaining] = useState<Timer>({
    hours: "00",
    minutes: "00",
  });

  const {
    state: { isConnected },
  } = useContext(OnboardContext);

  const { data: votePhase } = useVotePhase();

  const { data: round } = useRound(Number(roundId));

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
              {timeRemaining.hours}:{timeRemaining.minutes}
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
          publicKey={publicKey}
          isConnected={isConnected}
          activeRequests={activeRequests}
          encryptedVotes={encryptedVotes}
          refetchEncryptedVotes={refetchEncryptedVotes}
          revealedVotes={revealedVotes}
          votingAddress={votingAddress}
          hotAddress={hotAddress}
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
        />
      ) : null}
    </Wrapper>
  );
};

export default ActiveRequests;
