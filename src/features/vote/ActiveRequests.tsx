/** @jsxImportSource @emotion/react */
import { FC, useContext } from "react";
import tw, { styled } from "twin.macro"; // eslint-disable-line
import timerSVG from "assets/icons/timer.svg";
import ActiveRequestsForm from "./ActiveRequestsForm";
import {
  useVotingContract,
  useEncryptedVotesEvents,
  usePendingRequests,
  useVotePhase,
} from "hooks";
import { OnboardContext } from "common/context/OnboardContext";
// import { DateTime } from "luxon";

interface Props {
  // activeRequests: PriceRound[];
  publicKey: string;
  privateKey: string;
}

const ActiveRequests: FC<Props> = ({ publicKey, privateKey }) => {
  const {
    state: { address, network, signer, isConnected },
  } = useContext(OnboardContext);

  const { votingContract } = useVotingContract(signer, isConnected, network);

  const { data: activeRequests } = usePendingRequests();

  const { data: votePhase } = useVotePhase();
  useEncryptedVotesEvents(votingContract, address, privateKey);

  return (
    <StyledActiveRequests className="ActiveRequests">
      <div className="header-row" tw="flex items-stretch p-10">
        <div tw="flex-grow">
          <div className="title">
            Stage: <span>{votePhase} Votes</span>
          </div>
          <p className="big-title title">Active Requests</p>
        </div>
        <div tw="flex-grow text-right">
          <div className="title">Time Remaining</div>
          {activeRequests.length ? (
            <div className="time">
              00:00
              <span>
                <img src={timerSVG} alt="timer_img" />
              </span>
            </div>
          ) : (
            <div className="time">N/A</div>
          )}
        </div>
      </div>
      {activeRequests.length ? (
        <ActiveRequestsForm
          publicKey={publicKey}
          isConnected={isConnected}
          activeRequests={activeRequests}
          votePhase={votePhase}
        />
      ) : null}
    </StyledActiveRequests>
  );
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
