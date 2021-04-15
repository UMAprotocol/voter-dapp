/** @jsxImportSource @emotion/react */
import { FC, useContext, useState, useEffect } from "react";
import tw, { styled } from "twin.macro"; // eslint-disable-line
import timerSVG from "assets/icons/timer.svg";
import ActiveRequestsForm from "./ActiveRequestsForm";
import {
  useVotingContract,
  useEncryptedVotesEvents,
  useVotePhase,
  useCurrentRoundId,
  useRound,
  useVotingAddress,
} from "hooks";
import { OnboardContext } from "common/context/OnboardContext";
import Button from "common/components/button";
import { snapshotCurrentRound } from "web3/postVotingContractMethods";
import web3 from "web3";
import { getMessageSignatureMetamask } from "common/tempUmaFunctions";
import { PendingRequest } from "web3/queryVotingContractMethods";
import { DateTime } from "luxon";

interface Props {
  publicKey: string;
  privateKey: string;
  activeRequests: PendingRequest[];
}

const ActiveRequests: FC<Props> = ({
  publicKey,
  privateKey,
  activeRequests,
}) => {
  const [timeRemaining, setTimeRemaining] = useState<Timer>({
    hours: "00",
    minutes: "00",
  });

  const {
    state: { address, network, signer, isConnected, provider },
  } = useContext(OnboardContext);

  const { votingAddress } = useVotingAddress(address, signer, network);

  const { votingContract } = useVotingContract(signer, isConnected, network);

  const { data: votePhase } = useVotePhase();
  const { data: roundId } = useCurrentRoundId();
  const {
    data: encryptedVotes,
    refetch: refetchEncryptedVotes,
  } = useEncryptedVotesEvents(
    votingContract,
    votingAddress,
    privateKey,
    roundId
  );

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
    <StyledActiveRequests className="ActiveRequests">
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
    </StyledActiveRequests>
  );
};

interface Timer {
  hours: string;
  minutes: string;
}

const calculateTimeRemaining = (start: number, end: number) => {
  const difference = end - start;
  let timeLeft = {
    hours: "00",
    minutes: "00",
  };

  if (difference > 0) {
    timeLeft = {
      hours: Math.floor((difference / (60 * 60)) % 24).toString(),
      minutes: Math.floor((difference / 60) % 60).toString(),
    };
    if (timeLeft.hours === "0") timeLeft.hours = "00";
  }

  return timeLeft;
};

const StyledActiveRequests = styled.div`
  &.ActiveRequests {
    font-family: "Halyard Display";
    ${tw`max-w-full p-12`};
    background-color: #fff;
    .header-row {
      max-width: 1350px;
      margin: 0 auto;

      .title {
        font-size: 1.75rem;
        font-weight: 600;
        margin-bottom: 9px;
        letter-spacing: -0.02em;
        span {
          color: #ff4a4a;
        }
      }

      .big-title,
      .time {
        font-size: 2.5rem;
        font-weight: 600;
      }
      .big-title {
        line-height: 1.38;
      }
      .time {
        color: #ff4a4a;
        letter-spacing: 0.04em;
        span {
          margin-left: 8px;
          display: inline-block;
          img {
            margin-top: -4px;
          }
        }
      }
    }
  }
`;

export default ActiveRequests;
