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
  useCurrentRoundId,
} from "hooks";
import { OnboardContext } from "common/context/OnboardContext";
import Button from "common/components/button";
import { snapshotCurrentRound } from "web3/postVotingContractMethods";
import web3 from "web3";
import { ethers } from "ethers";
import { getMessageSignatureMetamask } from "common/tempUmaFunctions";

interface Props {
  // activeRequests: PriceRound[];
  publicKey: string;
  privateKey: string;
}

const ActiveRequests: FC<Props> = ({ publicKey, privateKey }) => {
  const {
    state: { address, network, signer, isConnected, provider },
  } = useContext(OnboardContext);

  const { votingContract } = useVotingContract(signer, isConnected, network);

  const { data: activeRequests } = usePendingRequests();

  const { data: votePhase } = useVotePhase();
  const { data: roundId } = useCurrentRoundId();
  const {
    data: encryptedVotes,
    refetch: refetchEncryptedVotes,
  } = useEncryptedVotesEvents(votingContract, address, privateKey, roundId);

  console.log("votePhase", votePhase);

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
          encryptedVotes={encryptedVotes}
          refetchEncryptedVotes={refetchEncryptedVotes}
        />
      ) : null}
      {activeRequests.length && !votePhase ? (
        <Button
          onClick={() => {
            if (!signer || !votingContract || !provider) return;
            // const message = `Sign For Snapshot`;
            votingContract.functions["snapshotMessageHash"]().then((hash) => {
              const sigHash = hash[0];
              const sigBytesHash = ethers.utils.arrayify(sigHash);
              if ((window as any).ethereum) {
                const mm = (window as any).ethereum;
                const Web3 = new web3(mm);
                console.log("web3", Web3);
                if (address) {
                  getMessageSignatureMetamask(Web3, sigHash, address).then(
                    (res) => {
                      console.log("res", res);
                      snapshotCurrentRound(votingContract, res).then((res) => {
                        console.log("success?", res);
                      });
                    }
                  );
                }
              }

              // signer
              //   .signMessage(sigBytesHash)
              //   .then((signedMsg) => {
              //     console.log("msg?", signedMsg);
              //     const verify = ethers.utils.verifyMessage(
              //       sigBytesHash,
              //       signedMsg
              //     );
              //     console.log("verify", verify);
              //     snapshotCurrentRound(votingContract, signedMsg).then(
              //       (res) => {
              //         console.log("success?", res);
              //       }
              //     );
              //   })
              //   .catch((err) => {
              //     console.log("Sign failed", err);
              //   });
            });
            // if (hashedMsg) {
            //   const hashBytes = ethers.utils.arrayify(hashedMsg);
            //   signer
            //     .signMessage(hashedMsg)
            //     .then((signedMsg) => {
            //       console.log("msg?", signedMsg);
            //       // const verify = ethers.utils.verifyMessage(
            //       //   hashedMsg,
            //       //   signedMsg
            //       // );
            //       // console.log("verify", verify);
            //       snapshotCurrentRound(votingContract, signedMsg).then(
            //         (res) => {
            //           console.log("success?", res);
            //         }
            //       );
            //     })
            //     .catch((err) => {
            //       console.log("Sign failed");
            //     });
            // }
          }}
          variant="secondary"
        >
          {signer ? "Snapshot Round" : "Connect Wallet to Snapshot"}
        </Button>
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
