import { FC, useContext, Dispatch, SetStateAction } from "react";
import tw from "twin.macro"; // eslint-disable-line
import web3 from "web3";
import { Wrapper } from "./styled/RevealPhase.styled";
import Button from "common/components/button";
import { EncryptedVote } from "web3/get/queryEncryptedVotesEvents";
import { PendingRequest } from "web3/get/queryGetPendingRequests";
import { revealVotes } from "web3/post/revealVotes";
import { useVotingContract } from "hooks";
import { OnboardContext } from "common/context/OnboardContext";
import { Round } from "web3/get/queryRounds";
import { getMessageSignatureMetamask } from "common/tempUmaFunctions";
import { snapshotCurrentRound } from "web3/post/snapshotCurrentRound";
import { VoteRevealed } from "web3/get/queryVotesRevealedEvents";
import { ModalState } from "./ActiveRequests";
import useTableValues from "./useTableValues";
import { ErrorContext } from "common/context/ErrorContext";

interface Props {
  isConnected: boolean;
  encryptedVotes: EncryptedVote[];
  activeRequests: PendingRequest[];
  hotAddress: string | null;
  votingAddress: string | null;
  round: Round;
  revealedVotes: VoteRevealed[];
  refetchEncryptedVotes: Function;
  refetchVoteRevealedEvents: Function;
  setViewDetailsModalState: Dispatch<SetStateAction<ModalState>>;
  openViewDetailsModal: () => void;
}

const RevealPhase: FC<Props> = ({
  isConnected,
  encryptedVotes,
  activeRequests,
  votingAddress,
  hotAddress,
  round,
  revealedVotes,
  refetchEncryptedVotes,
  openViewDetailsModal,
  setViewDetailsModalState,
  refetchVoteRevealedEvents,
}) => {
  const { tableValues, postRevealData, setPostRevealData } = useTableValues(
    activeRequests,
    encryptedVotes,
    revealedVotes
  );

  const {
    state: { network, signer, provider, notify },
  } = useContext(OnboardContext);
  const { addError } = useContext(ErrorContext);

  const { votingContract, designatedVotingContract } = useVotingContract(
    signer,
    isConnected,
    network,
    votingAddress,
    hotAddress
  );

  return (
    <Wrapper className="RequestPhase" isConnected={isConnected}>
      <table className="table">
        <thead>
          <tr>
            <th>Requested Vote</th>
            <th>Description</th>
            <th>Timestamp</th>
            <th className="center-header">Your Vote</th>
            <th className="center-header">Vote Status</th>
          </tr>
        </thead>
        <tbody>
          {tableValues.map((el, index) => {
            return (
              <tr key={index}>
                <td>
                  <div className="identifier">
                    <p>{el.identifier}</p>
                    <p
                      onClick={() => {
                        openViewDetailsModal();
                        setViewDetailsModalState({
                          timestamp: el.timestamp,
                          ancData: el.ancHex,
                          proposal: el.identifier,
                        });
                      }}
                      className="view-details"
                    >
                      View Details
                    </p>
                  </div>
                </td>
                <td>
                  <div className="description">{el.description}</div>
                </td>
                <td>
                  <div>{el.timestamp}</div>
                </td>
                <td>
                  <div>
                    {el.timestamp} ({el.unix})
                  </div>
                </td>
                <td>
                  <div>
                    <p className="vote">{el.vote}</p>
                  </div>
                </td>
                <td>
                  <div className="status">
                    {el.revealed ? (
                      <p>Revealed</p>
                    ) : el.vote !== UNDEFINED_VOTE && !el.revealed ? (
                      <p>Reveal</p>
                    ) : el.vote === UNDEFINED_VOTE ? (
                      <p>Uncommitted</p>
                    ) : null}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="end-row">
        <div className="end-row-item">
          {round.snapshotId === "0" ? (
            <Button
              onClick={() => {
                if (!signer || !votingContract || !provider) return;
                votingContract.functions["snapshotMessageHash"]().then(
                  (hash) => {
                    const sigHash = hash[0];
                    if ((window as any).ethereum) {
                      const mm = (window as any).ethereum;
                      const Web3 = new web3(mm);

                      // Make sure we use the hot address if the are using a two key contract.
                      let va = votingAddress;
                      if (hotAddress) va = hotAddress;
                      if (va) {
                        getMessageSignatureMetamask(Web3, sigHash, va).then(
                          (msg) => {
                            snapshotCurrentRound(votingContract, msg).then(
                              (tx) => {
                                // TODO: Refetch state after snapshot.
                                if (tx) {
                                  if (notify) notify.hash(tx.hash);
                                }
                              }
                            );
                          }
                        );
                      }
                    }
                  }
                );
              }}
              variant="secondary"
            >
              {signer ? "Snapshot Round" : "Connect Wallet to Snapshot"}
            </Button>
          ) : postRevealData.length ? (
            <Button
              type="button"
              onClick={() => {
                // Make sure to use the two key contract for revealing if it exists
                let vc = votingContract;
                if (designatedVotingContract) vc = designatedVotingContract;
                if (vc && postRevealData.length) {
                  return revealVotes(vc, postRevealData)
                    .then((tx) => {
                      if (tx) {
                        if (notify) notify.hash(tx.hash);
                        tx.wait(1).then((conf: any) => {
                          // refetch votes.
                          refetchVoteRevealedEvents();
                          refetchEncryptedVotes();
                          setPostRevealData([]);
                        });
                      }
                    })
                    .catch((err) => addError(err));
                }
              }}
              variant="secondary"
            >
              Reveal Votes
            </Button>
          ) : !postRevealData.length ? (
            <Button type="button" variant="disabled">
              Reveal Votes
            </Button>
          ) : null}
        </div>
      </div>
    </Wrapper>
  );
};

const UNDEFINED_VOTE = "-";

export default RevealPhase;
