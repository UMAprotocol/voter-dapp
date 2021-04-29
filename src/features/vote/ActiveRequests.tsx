/** @jsxImportSource @emotion/react */
import { FC, useContext, useState, useEffect } from "react";
import tw from "twin.macro"; // eslint-disable-line

import ActiveRequestsForm from "./ActiveRequestsForm";
import { useVotePhase, useRound } from "hooks";
import { OnboardContext } from "common/context/OnboardContext";
import Button from "common/components/button";
import { snapshotCurrentRound } from "web3/post/snapshotCurrentRound";
import { ethers } from "ethers";
import web3 from "web3";
import { getMessageSignatureMetamask } from "common/tempUmaFunctions";
import { PendingRequest } from "web3/get/queryGetPendingRequests";
import { DateTime } from "luxon";
import { calculateTimeRemaining } from "./helpers/calculateTimeRemaining";
import { Wrapper } from "./styled/ActiveRequests.styled";
import timerSVG from "assets/icons/timer.svg";
import { EncryptedVote } from "web3/get/queryEncryptedVotesEvents";
import { VoteRevealed } from "web3/get/queryVotesRevealedEvents";

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
  votingContract: ethers.Contract | null;
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
  votingContract,
  refetchEncryptedVotes,
  hotAddress,
}) => {
  const [timeRemaining, setTimeRemaining] = useState<Timer>({
    hours: "00",
    minutes: "00",
  });

  const {
    state: { signer, isConnected, provider },
  } = useContext(OnboardContext);

  const { data: votePhase } = useVotePhase();

  const { data: round } = useRound(Number(roundId));

  // Set time remaining depending if it's the Commit or Reveal
  // Note: the requests are all slightly differently in there final vote time. I'll use the last
  // Vote added.
  useEffect(() => {
    const arLength = activeRequests.length;
    const requestTimestamp = DateTime.fromSeconds(
      Number(activeRequests[arLength - 1].time)
    );

    if (votePhase === "Commit") {
      // Add two days, as the price requests are added 24 hours before, and commit ends 48 hours after that.
      // For some reason need to add 1 hour? Daylights saving times issue?
      const endOfCommit = requestTimestamp
        .plus({ days: 2, hours: 1 })
        .toSeconds();

      setTimeRemaining(
        calculateTimeRemaining(DateTime.local().toSeconds(), endOfCommit)
      );

      const timer = setInterval(() => {
        setTimeRemaining(
          calculateTimeRemaining(DateTime.local().toSeconds(), endOfCommit)
        );
      }, 30000);

      return () => clearInterval(timer);
    }

    if (votePhase === "Reveal") {
      // Add three days, as the price requests are added 24 hours before, and reveal ends 72 hours after that.
      const endOfCommit = requestTimestamp.plus({ days: 3 }).toSeconds();

      setTimeRemaining(
        calculateTimeRemaining(DateTime.local().toSeconds(), endOfCommit)
      );

      const timer = setInterval(() => {
        setTimeRemaining(
          calculateTimeRemaining(DateTime.local().toSeconds(), endOfCommit)
        );
      }, 30000);

      return () => clearInterval(timer);
    }
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
      <ActiveRequestsForm
        publicKey={publicKey}
        isConnected={isConnected}
        activeRequests={activeRequests}
        votePhase={votePhase}
        encryptedVotes={encryptedVotes}
        refetchEncryptedVotes={refetchEncryptedVotes}
        revealedVotes={revealedVotes}
        votingAddress={votingAddress}
        hotAddress={hotAddress}
      />
      {activeRequests.length &&
      votePhase === "Reveal" &&
      round.snapshotId === "0" ? (
        <Button
          onClick={() => {
            if (!signer || !votingContract || !provider) return;
            votingContract.functions["snapshotMessageHash"]().then((hash) => {
              const sigHash = hash[0];
              if ((window as any).ethereum) {
                const mm = (window as any).ethereum;
                const Web3 = new web3(mm);
                if (votingAddress) {
                  getMessageSignatureMetamask(
                    Web3,
                    sigHash,
                    votingAddress
                  ).then((msg) => {
                    snapshotCurrentRound(votingContract, msg).then((tx) => {
                      // TODO: Refetch state after snapshot.
                      console.log("success?", tx);
                    });
                  });
                }
              }
            });
          }}
          variant="secondary"
        >
          {signer ? "Snapshot Round" : "Connect Wallet to Snapshot"}
        </Button>
      ) : null}
    </Wrapper>
  );
};

export default ActiveRequests;
