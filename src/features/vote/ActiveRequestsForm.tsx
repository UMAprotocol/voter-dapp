/** @jsxImportSource @emotion/react */
import { FC, useCallback, useContext } from "react";
import { useForm } from "react-hook-form";
import tw, { styled } from "twin.macro"; // eslint-disable-line
import { UnlockedIcon } from "assets/icons";
import { PendingRequest } from "web3/queryVotingContractMethods";
import Button from "common/components/button";
import TextInput from "common/components/text-input";
import Modal from "common/components/modal";
import useModal from "common/hooks/useModal";
import Select from "common/components/select";
import { useVotingContract } from "hooks";
import { postCommitVotes } from "web3/postVotingContractMethods";

import { useCurrentRoundId } from "hooks";
import { OnboardContext } from "common/context/OnboardContext";
import { useVotesCommittedEvents } from "hooks";
import { formatVoteDataToCommit } from "./helpers";

export type FormData = {
  [key: string]: string;
};

interface Summary {
  identifier: string;
  value: string;
}

interface Props {
  activeRequests: PendingRequest[];
  isConnected: boolean;
  publicKey: string;
  votePhase: string;
}

const ActiveRequestsForm: FC<Props> = ({
  activeRequests,
  isConnected,
  publicKey,
  votePhase,
}) => {
  const {
    state: { address, network, signer },
  } = useContext(OnboardContext);
  const { votingContract } = useVotingContract(signer, isConnected, network);
  const { data } = useVotesCommittedEvents(votingContract, address);
  console.log("vote events", data);

  const { data: roundId } = useCurrentRoundId();
  const { isOpen, open, close, modalRef } = useModal();
  const generateDefaultValues = useCallback(() => {
    const dv = {} as FormData;
    activeRequests.forEach((el) => {
      dv[el.identifier] = "";
    });

    return dv;
  }, [activeRequests]);

  const { handleSubmit, control, watch } = useForm<FormData>({
    defaultValues: generateDefaultValues(),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    const validValues = {} as FormData;
    for (let i = 0; i < Object.keys(data).length; i++) {
      if (Object.values(data)[i] !== "")
        validValues[Object.keys(data)[i]] = Object.values(data)[i];
    }

    // Format data.
    formatVoteDataToCommit(
      validValues,
      activeRequests,
      roundId,
      address,
      publicKey
    ).then((fd) => {
      if (votingContract) {
        postCommitVotes(votingContract, fd).then((tx) => {
          console.log("tx created?", tx);
        });
      }
    });
  };
  const watchAllFields = watch();

  const showSummary = useCallback(() => {
    const anyFields = Object.values(watchAllFields).filter((x) => x !== "");
    if (anyFields.length) {
      // console.log("any fields", anyFields);
      const showSummary = [] as Summary[];
      const identifiers = Object.keys(watchAllFields);
      const values = Object.values(watchAllFields);
      for (let i = 0; i < identifiers.length; i++) {
        if (values[i] !== "") {
          const val = {
            identifier: identifiers[i],
            value: values[i],
          };
          showSummary.push(val);
        }
      }
      return showSummary;
    } else {
      return [];
    }
  }, [watchAllFields]);

  return (
    <StyledActiveRequestsForm
      className="ActiveRequestsForm"
      isConnected={isConnected}
      onSubmit={handleSubmit(onSubmit)}
    >
      <table className="table">
        <thead>
          <tr>
            <th>Requested Vote</th>
            <th>Proposal Detail</th>
            <th>Description</th>
            <th>Your Vote</th>
            <th>Vote Status</th>
          </tr>
        </thead>
        <tbody>
          {activeRequests.map((el, index) => {
            return (
              <tr key={index}>
                <td>
                  <div className="identifier">{el.identifier}</div>
                </td>
                <td>{el.ancillaryData}</td>
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
                    <UnlockedIcon />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="end-row">
        <div className="end-row-item">
          Need to enable two key voting? Click here.
        </div>
        <div className="end-row-item">
          <Button
            variant={
              Object.values(watchAllFields).filter((x) => x !== "").length
                ? "secondary"
                : "disabled"
            }
            onClick={() => {
              if (showSummary().length && votePhase === "Commit") open();
            }}
          >
            Commit Votes
          </Button>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={close} ref={modalRef}>
        <StyledModal>
          <div className="icon-wrapper">
            <UnlockedIcon className="unlocked-icon" />
          </div>
          <h3 className="header">Ready to commit these votes?</h3>
          {showSummary().length
            ? showSummary().map((el, index) => {
                return (
                  <div className="vote-wrapper" key={index}>
                    <div>{el.identifier}</div>
                    <div>{el.value}</div>
                  </div>
                );
              })
            : null}
          <div className="button-wrapper">
            <Button onClick={() => close()} variant="primary">
              Not Yet
            </Button>
            <Button onClick={handleSubmit(onSubmit)} variant="secondary">
              I'm Ready
            </Button>
          </div>
        </StyledModal>
      </Modal>
    </StyledActiveRequestsForm>
  );
};

interface StyledFormProps {
  isConnected: boolean;
}

const StyledActiveRequestsForm = styled.form<StyledFormProps>`
  &.ActiveRequestsForm {
    .table {
      ${tw`table-auto`};
      width: 100%;
      max-width: 1250px;
      margin: 0 auto;
      border-collapse: separate;
      border-spacing: 0 15px;
      /* pointer-events: ${(props) => (props.isConnected ? "all" : "none")};
    cursor: ${(props) => (props.isConnected ? "auto" : "not-allowed")}; */
      .input-cell {
        cursor: ${(props) => (props.isConnected ? "auto" : "not-allowed")};
        input,
        select {
          pointer-events: ${(props) => (props.isConnected ? "all" : "none")};
          opacity: ${(props) => (props.isConnected ? "1" : "0.5")};
        }
      }
      select {
      }
      thead {
        tr {
          text-align: left;
          margin-bottom: 2rem;
        }
        th:last-child {
          text-align: center;
        }
      }

      tbody {
        td {
          div {
            display: flex;
            align-items: center;
          }
          .description {
            max-width: 500px;
          }
        }
        td:first-of-type {
          /* div {

      }
      max-width: 150px; */
        }

        td:last-child {
          svg {
            margin: 0 auto;
          }
        }
      }
    }
    .end-row {
      margin-top: 1rem;
      display: flex;
      justify-content: space-between;
      .end-row-item {
      }
    }
  }
`;

const StyledModal = styled.div`
  /* max-width: 700; */
  min-width: 400px;
  padding: 2rem 1.5rem;
  height: auto;
  position: relative;
  background-color: #fff;
  z-index: 1;
  overflow-y: auto;
  border-radius: 12px;
  margin: 0;
  outline: 0;
  box-sizing: border-box;
  font-family: "Halyard Display";
  border: none;
  .header {
    text-align: center;
    margin-bottom: 1rem;
    font-weight: 600;
    font-size: 1.25rem;
  }
  .header-body {
    border-color: #e5e5e5;
    padding-bottom: 4rem;
  }
  .open-form {
    color: #ff4a4a;
    font-size: 0.8rem;
    line-height: 2rem;
    text-decoration: underline;
  }
  .icon-wrapper {
    margin-top: 1rem;
    height: 100px;
    .unlocked-icon {
      margin: 0 auto;
      transform: scale(2);
    }
  }
  .vote-wrapper {
    display: flex;
    justify-content: space-between;
    padding: 1rem 0;
    border-bottom: 1px solid #e5e5e5;
    div:last-child {
      color: #ff4a4a;
      text-transform: uppercase;
    }
  }
  .button-wrapper {
    margin-top: 1.5rem;
    text-align: center;

    width: 400px;
    button {
      margin: 0 0.5rem;
    }
  }
`;

export default ActiveRequestsForm;
