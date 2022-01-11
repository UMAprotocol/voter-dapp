import { FC, useContext, useState, Dispatch, SetStateAction } from "react";
import tw from "twin.macro"; // eslint-disable-line
import web3 from "web3";
import { Wrapper } from "./styled/RevealPhase.styled";
import Button from "common/components/button";
import { EncryptedVote } from "common/web3/get/queryEncryptedVotesEvents";
import { PendingRequest } from "common/web3/get/queryGetPendingRequests";
import { revealVotes } from "common/web3/post/revealVotes";
import { useVotingContract } from "hooks";
import { OnboardContext } from "common/context/OnboardContext";
import { Round } from "common/web3/get/queryRounds";
import { getMessageSignatureMetamask } from "common/tempUmaFunctions";
import { snapshotCurrentRound } from "common/web3/post/snapshotCurrentRound";
import { VoteRevealed } from "common/web3/get/queryVotesRevealedEvents";
import { ModalState } from "./ActiveRequests";
import useTableValues from "./hooks/useTableValues";
import { ErrorContext } from "common/context/ErrorContext";
import { RefetchOptions, QueryObserverResult } from "react-query";
import useModal from "common/hooks/useModal";
import DescriptionModal from "./DescriptionModal";

import {
  Description,
  Table,
  FullDate,
  DescriptionWrapper,
} from "./styled/ActiveRequests.styled";

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
  refetchRound: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<void | Round | undefined, unknown>>;
  refetchRoundId: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<string | void | undefined, unknown>>;
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
  refetchRound,
  refetchRoundId,
}) => {
  const [description, setDescription] = useState("");
  const [proposal, setProposal] = useState("");

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

  const {
    isOpen: descriptionIsOpen,
    open: descriptionOpen,
    close: descriptionClose,
    modalRef: descriptionModalRef,
  } = useModal();

  return (
    <Wrapper className="RequestPhase" isConnected={isConnected}>
      <Table isConnected={isConnected} className="table">
        <thead>
          <tr>
            <th>Requested Vote</th>
            <th>Description</th>
            <th>UNIX Timestamp</th>
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
                          unix: el.unix,
                        });
                      }}
                      className="view-details"
                    >
                      View Details
                    </p>
                  </div>
                </td>
                <td>
                  <DescriptionWrapper>
                    {el.description && el.description.length > 255 ? (
                      <Description>
                        {el.description.slice(0, 255)}...{" "}
                        <span
                          onClick={() => {
                            setDescription(
                              el.description || "Missing description"
                            );
                            setProposal(el.identifier);
                            descriptionOpen();
                          }}
                        >
                          Read More
                        </span>{" "}
                      </Description>
                    ) : (
                      <Description>{el.description}</Description>
                    )}
                  </DescriptionWrapper>
                </td>
                <td>
                  <div>{el.unix}</div>
                  <FullDate>({el.timestamp})</FullDate>
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
                      <p>Unrevealed</p>
                    ) : el.vote === UNDEFINED_VOTE ? (
                      <p>-</p>
                    ) : null}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <div className="end-row">
        <div className="end-row-item">
          {round.snapshotId === NO_SNAPSHOT_VALUE ? (
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
                            snapshotCurrentRound(votingContract, msg)
                              .then((tx) => {
                                // TODO: Refetch state after snapshot.
                                if (tx) {
                                  if (notify) notify.hash(tx.hash);
                                  // Get roundID immediately to move snapshot on.
                                  tx.wait(1).then(() => {
                                    refetchRound();
                                    refetchRoundId();
                                  });
                                }
                              })
                              .catch((err) => {
                                console.error("err in snapshot", err);
                                addError(err);
                              });
                          }
                        );
                      }
                    }
                  }
                );
              }}
              variant={signer ? "secondary" : "disabled"}
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
      <DescriptionModal
        isOpen={descriptionIsOpen}
        close={descriptionClose}
        ref={descriptionModalRef}
        description={description}
        setDescription={setDescription}
        proposal={proposal}
        setProposal={setProposal}
      />
    </Wrapper>
  );
};

const UNDEFINED_VOTE = "-";
const NO_SNAPSHOT_VALUE = "0";

export default RevealPhase;
