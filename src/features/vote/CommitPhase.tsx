/** @jsxImportSource @emotion/react */
import { FC, useCallback, useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { PendingRequest } from "web3/get/queryGetPendingRequests";
import Button from "common/components/button";
import TextInput from "common/components/text-input";
import useModal from "common/hooks/useModal";
import Select from "common/components/select";
import { useVotingContract } from "hooks";
import { commitVotes } from "web3/post/commitVotes";
import SubmitCommitsModal from "./SubmitCommitsModal";

import { ethers } from "ethers";
import { useCurrentRoundId } from "hooks";
import { OnboardContext } from "common/context/OnboardContext";
import { formatVoteDataToCommit } from "./helpers/formatVoteDataToCommit";
import { EncryptedVote } from "web3/get/queryEncryptedVotesEvents";

import { FormWrapper } from "./styled/CommitPhase.styled";
import { VoteRevealed } from "web3/get/queryVotesRevealedEvents";

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
}

interface TableValue {
  ancillaryData: string;
  identifier: string;
  vote: string;
  revealed: boolean;
  ancHex: string;
}

const UNDEFINED_VOTE = "-";

export type SubmitModalState = "init" | "pending" | "success" | "error";

const ActiveRequestsForm: FC<Props> = ({
  activeRequests,
  isConnected,
  publicKey,
  encryptedVotes,
  refetchEncryptedVotes,
  revealedVotes,
  votingAddress,
  hotAddress,
}) => {
  const [modalState, setModalState] = useState<SubmitModalState>("init");

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

  const [tableValues, setTableValues] = useState<TableValue[]>([]);

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
            console.log("FD", fd, publicKey);
            commitVotes(vc, fd).then((tx) => {
              setModalState("pending");
              // Need to confirm if the user submits the vote.
              if (tx) {
                tx.wait(1).then((conf: any) => {
                  // Temporary, as mining is instant on local ganache.
                  setTimeout(() => setModalState("success"), 5000);
                  refetchEncryptedVotes();
                });
              }
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

  // Take activeRequests and encryptedVotes and convert them into tableViews
  useEffect(() => {
    // Check if the user has voted in this round.
    if (activeRequests.length && !encryptedVotes.length) {
      const tv: TableValue[] = activeRequests.map((el) => {
        return {
          ancillaryData: el.ancillaryData,
          vote: "-",
          identifier: el.identifier,
          revealed: false,
          ancHex: el.idenHex,
        };
      });

      setTableValues(tv);
    }
    if (activeRequests.length && encryptedVotes.length) {
      const tv = [] as TableValue[];
      activeRequests.forEach((el) => {
        const datum = {} as TableValue;
        datum.ancillaryData = el.ancillaryData;
        datum.identifier = el.identifier;
        let vote = "-";
        // I believe latest events are on bottom. requires testing.
        const latestVotesFirst = [...encryptedVotes].reverse();
        const findVote = latestVotesFirst.find(
          (x) =>
            x.identifier === el.identifier &&
            x.ancillaryData === el.ancHex &&
            x.time === el.time
        );

        if (findVote) {
          datum.vote = ethers.utils.formatEther(findVote.price);
          if (el.identifier.includes("Admin")) {
            if (datum.vote === "1" || datum.vote === "1.0") datum.vote = "Yes";
            if (datum.vote === "0" || datum.vote === "0.0") datum.vote = "No";
          }
        } else {
          datum.vote = vote;
        }
        const findReveal = revealedVotes.find(
          (x) =>
            x.identifier === el.identifier &&
            x.ancillaryData === el.ancHex &&
            x.time === el.time
        );
        if (findReveal) {
          datum.revealed = true;
        } else {
          datum.revealed = false;
        }

        tv.push(datum);
      });
      setTableValues(tv);
    }
  }, [activeRequests, encryptedVotes, revealedVotes]);

  return (
    <FormWrapper
      className="CommitPhase"
      isConnected={isConnected}
      onSubmit={handleSubmit(onSubmit)}
    >
      <table className="table">
        <thead>
          <tr>
            <th>Requested Vote</th>
            <th>Description</th>
            <th>Commit Vote</th>
            <th>Your Vote</th>
            <th>Vote Status</th>
          </tr>
        </thead>
        <tbody>
          {tableValues.map((el, index) => {
            return (
              <tr key={index}>
                <td>
                  <div className="identifier">{el.identifier}</div>
                </td>
                <td>
                  <div className="description">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Curabitur sed eleifend erat. Duis in ante nisi. Donec ut
                    nibh id justo faucibus fermentum id id ex. Mauris
                    sollicitudin consequat neque.
                  </div>
                </td>
                <td className="input-cell">
                  {el.identifier.includes("Admin") ? (
                    <div>
                      <Select control={control} name={`${el.identifier}`} />
                    </div>
                  ) : (
                    <TextInput
                      label="Input your vote."
                      control={control}
                      name={`${el.identifier}`}
                      placeholder="0.000"
                      variant="currency"
                    />
                  )}
                </td>
                <td>
                  <div>
                    <p className="vote">{el.vote}</p>
                  </div>
                </td>
                <td>
                  <div>
                    {el.vote !== UNDEFINED_VOTE ? "Committed" : "Uncommitted"}
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
            Commit Votes
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
      />
    </FormWrapper>
  );
};

export default ActiveRequestsForm;
