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
import { PendingRequest } from "common/web3/get/queryGetPendingRequests";
import Button from "common/components/button";
import TextInput from "common/components/text-input";
import useModal from "common/hooks/useModal";
import RHFDropdown from "common/components/dropdown/RHFDropdown";

import { useVotingContract, useCurrentRoundId } from "hooks";
import { commitVotes } from "common/web3/post/commitVotes";
import SubmitCommitsModal from "./SubmitCommitsModal";

import { OnboardContext } from "common/context/OnboardContext";
import { formatVoteDataToCommit } from "./helpers/formatVoteDataToCommit";
import { EncryptedVote } from "common/web3/get/queryEncryptedVotesEvents";

import {
  FormWrapper,
  CommitInputLabel,
  NoPublicKeyErrorWrapper,
} from "./styled/CommitPhase.styled";
import { VoteRevealed } from "common/web3/get/queryVotesRevealedEvents";
import { ModalState } from "./ActiveRequests";

import useTableValues from "./hooks/useTableValues";
import {
  Description,
  Table,
  FullDate,
  DescriptionWrapper,
} from "./styled/ActiveRequests.styled";
import DescriptionModal from "./DescriptionModal";
import currentSigningMessage from "common/helpers/currentSigningMessage";

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
  signingMessage: string;
}

const UNDEFINED_VOTE = "-";

export type SubmitModalState = "init" | "pending" | "success" | "error";

const inputRegExp = new RegExp(/^[-]?([0-9]*[.])?[0-9]+$/);

const INVALID_MAGIC_NUMBER =
  "57896044618658097711785492504343953926634992332820282019728.792003956564819968";

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
  signingMessage,
}) => {
  const [submitErrorMessage, setSubmitErrorMessage] = useState("");
  const [buttonVariant, setButtonVariant] = useState<"secondary" | "disabled">(
    "disabled"
  );

  const {
    state: { network, signer, notify },
  } = useContext(OnboardContext);
  const { votingContract, designatedVotingContract } = useVotingContract(
    signer,
    isConnected,
    network,
    votingAddress,
    hotAddress
  );

  const { tableValues } = useTableValues(
    activeRequests,
    encryptedVotes,
    revealedVotes
  );

  const { data: roundId = "" } = useCurrentRoundId();
  const { isOpen, open, close, modalRef } = useModal();
  const {
    isOpen: descriptionIsOpen,
    open: descriptionOpen,
    close: descriptionClose,
    modalRef: descriptionModalRef,
  } = useModal();
  const [description, setDescription] = useState("");
  const [proposal, setProposal] = useState("");

  const generateDefaultValues = useCallback(() => {
    const dv = {} as FormData;
    activeRequests.forEach((el) => {
      dv[`${el.identifier}~${el.time}~${el.ancHex}`] = "";
    });

    return dv;
  }, [activeRequests]);

  const { handleSubmit, control, watch, reset, setValue, setError } =
    useForm<FormData>({
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
        if (
          Object.values(data)[i] !== "" &&
          Object.values(data)[i] !== undefined &&
          Object.values(data)[i] !== INVALID_MAGIC_NUMBER
        ) {
          validValues[Object.keys(data)[i]] = Object.values(data)[i];
        }
      }
      const message = currentSigningMessage(Number(roundId));
      if (signingMessage !== message)
        return setSubmitErrorMessage(
          "Signing message does not match message for current round. Please disconnect and resign message for current round and try to commit again."
        );

      if (publicKey === "")
        return setSubmitErrorMessage(
          "Signing Key undefined. Please refresh, reconnect, and try again."
        );
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
            commitVotes(vc, fd.postValues)
              .then((tx) => {
                localStorage.setItem(
                  "backupCommits",
                  JSON.stringify(fd.newCommits)
                );
                setSubmitErrorMessage("");
                close();
                reset();
                // Need to confirm if the user submits the vote.
                assert(tx, "Transaction did not get submitted, try again");
                if (notify) notify.hash(tx.hash);

                tx.wait(1)
                  .then((conf: any) => {
                    refetchEncryptedVotes();
                    reset();
                  })
                  .catch((err: any) => {
                    setSubmitErrorMessage(`Error with tx: ${err.message}`);
                  });
              })
              .catch((err) => {
                setSubmitErrorMessage(err.message);
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
      refetchEncryptedVotes,
      designatedVotingContract,
      votingAddress,
      reset,
      notify,
      close,
      signingMessage,
    ]
  );

  const watchAllFields = watch();

  const showModalSummary = useCallback(() => {
    const anyFields = Object.values(watchAllFields).filter((x) => x !== "");

    if (anyFields.length) {
      const summary = [] as Summary[];
      const identifiers = Object.keys(watchAllFields);
      const values = Object.values(watchAllFields);
      let passesValidation = true;
      for (let i = 0; i < identifiers.length; i++) {
        if (values[i] !== "" && values[i] !== undefined) {
          const idenSplit = identifiers[i].split("~");

          const val = {
            identifier: `${idenSplit[0]} -- ${idenSplit[1]}`,
            value: values[i],
          };

          // Double check the fields pass the input reg exp, otherwise don't show the summary until user fixes it.
          if (
            (!identifiers[i].includes("Admin") &&
              !inputRegExp.test(values[i])) ||
            values[i] === INVALID_MAGIC_NUMBER
          ) {
            if (values[i] === INVALID_MAGIC_NUMBER)
              setError(identifiers[i], {
                message: "Magic number needs to be negative",
              });
            passesValidation = false;
          }
          summary.push(val);
        }
      }
      if (passesValidation) {
        setButtonVariant("secondary");
      } else {
        setButtonVariant("disabled");
      }
      return summary;
    } else {
      setButtonVariant("disabled");
      return [];
    }
  }, [watchAllFields, setButtonVariant, setError]);

  const [noPublicKeyError, setNoPublicKeyError] = useState(false);
  useEffect(() => {
    if (publicKey && noPublicKeyError) setNoPublicKeyError(false);
  }, [publicKey, noPublicKeyError]);

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
      <Table isConnected={isConnected} className="table">
        <thead>
          <tr>
            <th>Requested Vote</th>
            <th>Description</th>
            <th>UNIX Timestamp</th>
            <th>Commit Vote</th>
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
                  <DescriptionWrapper className="description">
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
                <td className="input-cell">
                  {el.identifier.includes("Admin") ? (
                    <>
                      <CommitInputLabel>
                        Current vote: {el.vote}
                      </CommitInputLabel>
                      <div className="select">
                        <RHFDropdown
                          control={control}
                          name={`${el.identifier}~${el.unix}~${el.ancHex}`}
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
                      </div>
                    </>
                  ) : (
                    <TextInput
                      label={`Current vote: ${el.vote ?? ""}`}
                      showValueInLabel
                      control={control}
                      name={`${el.identifier}~${el.unix}~${el.ancHex}`}
                      placeholder="0.000"
                      variant="text"
                      rules={{
                        pattern: {
                          value: /^[-]?([0-9]*[.])?[0-9]+$/,
                          message: "Please input a valid number.",
                        },
                      }}
                      // Getting very strange type errors here. Todo: Fix these so any isn't required.
                      setValue={setValue}
                      setError={setError}
                    />
                  )}
                </td>

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
      </Table>
      <div className="end-row">
        <div className="end-row-item">
          <Button
            type="button"
            variant={buttonVariant}
            onClick={() => {
              if (!publicKey) return setNoPublicKeyError(true);
              if (showModalSummary().length) return open();
            }}
          >
            Commit Vote(s)
          </Button>
          {noPublicKeyError && (
            <NoPublicKeyErrorWrapper>
              Message was not signed. Reconnect to your wallet and sign the
              message to continue.
            </NoPublicKeyErrorWrapper>
          )}
        </div>
      </div>
      <SubmitCommitsModal
        isOpen={isOpen}
        close={close}
        ref={modalRef}
        showModalSummary={showModalSummary}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        submitErrorMessage={submitErrorMessage}
        setSubmitErrorMessage={setSubmitErrorMessage}
        hotAddress={hotAddress}
        votingAddress={votingAddress}
      />
      <DescriptionModal
        isOpen={descriptionIsOpen}
        close={descriptionClose}
        ref={descriptionModalRef}
        description={description}
        setDescription={setDescription}
        proposal={proposal}
        setProposal={setProposal}
      />
    </FormWrapper>
  );
};

export default CommitPhase;
