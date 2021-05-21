/** @jsxImportSource @emotion/react */
import {
  FC,
  useCallback,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import assert from "assert";
import { useForm } from "react-hook-form";
import { PendingRequest } from "web3/get/queryGetPendingRequests";
import Button from "common/components/button";
import TextInput from "common/components/text-input";
import useModal from "common/hooks/useModal";
import RHFDropdown from "common/components/dropdown/RHFDropdown";

import { useVotingContract, useCurrentRoundId } from "hooks";
import { commitVotes } from "web3/post/commitVotes";
import SubmitCommitsModal from "./SubmitCommitsModal";

import { OnboardContext } from "common/context/OnboardContext";
import { formatVoteDataToCommit } from "./helpers/formatVoteDataToCommit";
import { EncryptedVote } from "web3/get/queryEncryptedVotesEvents";

import { FormWrapper } from "./styled/CommitPhase.styled";
import { VoteRevealed } from "web3/get/queryVotesRevealedEvents";
import { ModalState } from "./ActiveRequests";

import useTableValues from "./useTableValues";

export type FormData = {
  [key: string]: string;
};

export interface Summary {
  identifier: string;
  value: string;
}

interface Props {
  activeRequests: PendingRequest[];
  isConnected: boolean;
  publicKey: string;
  encryptedVotes: EncryptedVote[];
  refetchEncryptedVotes: Function;
  revealedVotes: VoteRevealed[];
  hotAddress: string | null;
  votingAddress: string | null;
  setViewDetailsModalState: Dispatch<SetStateAction<ModalState>>;
  openViewDetailsModal: () => void;
}

const UNDEFINED_VOTE = "-";

export type SubmitModalState = "init" | "pending" | "success" | "error";

const CommitPhase: FC<Props> = ({
  activeRequests,
  isConnected,
  publicKey,
  encryptedVotes,
  refetchEncryptedVotes,
  revealedVotes,
  votingAddress,
  hotAddress,
  setViewDetailsModalState,
  openViewDetailsModal,
}) => {
  const [modalState, setModalState] = useState<SubmitModalState>("init");
  const [submitErrorMessage, setSubmitErrorMessage] = useState("");
  const {
    state: { network, signer },
  } = useContext(OnboardContext);
  const { votingContract, designatedVotingContract } = useVotingContract(
    signer,
    isConnected,
    network,
    votingAddress,
    hotAddress
  );

  const { tableValues, hasVoted } = useTableValues(
    activeRequests,
    encryptedVotes,
    revealedVotes
  );

  const { data: roundId } = useCurrentRoundId();
  const { isOpen, open, close, modalRef } = useModal();

  const generateDefaultValues = useCallback(() => {
    const dv = {} as FormData;
    activeRequests.forEach((el) => {
      dv[el.identifier] = "";
    });

    return dv;
  }, [activeRequests]);

  const { handleSubmit, control, watch, reset } = useForm<FormData>({
    defaultValues: generateDefaultValues(),
  });

  // Make sure to reset form state if the user disconnects *or* changes their address.
  // As we disconenct them on address, isConnected should cover this state change.
  useEffect(() => {
    if (!isConnected) {
      reset();
      close();
    }
  }, [isConnected, reset, close]);

  const onSubmit = useCallback(
    (data: FormData) => {
      const validValues = {} as FormData;
      for (let i = 0; i < Object.keys(data).length; i++) {
        if (Object.values(data)[i] !== "")
          validValues[Object.keys(data)[i]] = Object.values(data)[i];
      }

      if (votingAddress) {
        // Format data.
        formatVoteDataToCommit(
          validValues,
          activeRequests,
          roundId,
          votingAddress,
          publicKey
        ).then((fd) => {
          // If the DVC exists, use that to commit votes instead.
          let vc = votingContract;
          if (designatedVotingContract) vc = designatedVotingContract;
          if (vc) {
            commitVotes(vc, fd)
              .then((tx) => {
                setModalState("pending");
                setSubmitErrorMessage("");
                // Need to confirm if the user submits the vote.
                assert(tx, "Transaction did not get submitted, try again");
                if (tx) {
                  tx.wait(1)
                    .then((conf: any) => {
                      // Temporary, as mining is instant on local ganache.
                      // setTimeout(() => setModalState("success"), 5000);
                      setModalState("success");
                      refetchEncryptedVotes();
                      reset();
                    })
                    .catch((err: any) => {
                      setSubmitErrorMessage("Error with tx.");
                      setModalState("init");
                    });
                }
              })
              .catch((err) => {
                setSubmitErrorMessage(err.message);
                setModalState("init");
              });
          }
        });
      }
    },
    [
      activeRequests,
      publicKey,
      roundId,
      votingContract,
      setModalState,
      refetchEncryptedVotes,
      designatedVotingContract,
      votingAddress,
      reset,
    ]
  );

  const watchAllFields = watch();

  const showModalSummary = useCallback(() => {
    const anyFields = Object.values(watchAllFields).filter((x) => x !== "");
    if (anyFields.length) {
      const summary = [] as Summary[];
      const identifiers = Object.keys(watchAllFields);
      const values = Object.values(watchAllFields);
      for (let i = 0; i < identifiers.length; i++) {
        if (values[i] !== "") {
          const val = {
            identifier: identifiers[i],
            value: values[i],
          };
          summary.push(val);
        }
      }
      return summary;
    } else {
      return [];
    }
  }, [watchAllFields]);

  return (
    <FormWrapper
      className="CommitPhase"
      isConnected={isConnected}
      publicKey={publicKey}
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit(onSubmit);
      }}
    >
      <table className="table">
        <thead>
          <tr>
            <th>Requested Vote</th>
            <th>Description</th>
            <th>Commit Vote</th>
            {hasVoted ? <th className="center-header">Your Vote</th> : null}
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
                <td className="input-cell">
                  {el.identifier.includes("Admin") ? (
                    <div className="select">
                      <RHFDropdown
                        control={control}
                        name={`${el.identifier}`}
                        items={[
                          {
                            value: "",
                            label: "---",
                          },
                          {
                            value: "yes",
                            label: "Yes",
                          },
                          {
                            value: "no",
                            label: "No",
                          },
                        ]}
                      />

                      {/* <Select control={control} name={`${el.identifier}`} /> */}
                    </div>
                  ) : (
                    <TextInput
                      label="Input your vote."
                      control={control}
                      name={`${el.identifier}`}
                      placeholder="0.000"
                      variant="text"
                    />
                  )}
                </td>

                {hasVoted ? (
                  <td>
                    <div>
                      <p className="vote">{el.vote}</p>
                    </div>
                  </td>
                ) : null}

                <td>
                  <div className="status">
                    {!isConnected ? (
                      <p>-</p>
                    ) : el.vote !== UNDEFINED_VOTE ? (
                      <p>Committed</p>
                    ) : (
                      <p>Uncommitted</p>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="end-row">
        <div className="end-row-item">
          <Button
            type="button"
            variant={
              Object.values(watchAllFields).filter((x) => x !== "").length
                ? "secondary"
                : "disabled"
            }
            onClick={() => {
              if (showModalSummary().length) open();
            }}
          >
            Commit Vote(s)
          </Button>
        </div>
      </div>
      <SubmitCommitsModal
        isOpen={isOpen}
        close={close}
        ref={modalRef}
        modalState={modalState}
        setModalState={setModalState}
        showModalSummary={showModalSummary}
        reset={reset}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        submitErrorMessage={submitErrorMessage}
        setSubmitErrorMessage={setSubmitErrorMessage}
      />
    </FormWrapper>
  );
};

export default CommitPhase;
