/** @jsxImportSource @emotion/react */
import { FC, useCallback, useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import tw, { styled } from "twin.macro"; // eslint-disable-line
import { UnlockedIcon, LockedIconCommitted } from "assets/icons";
import { PendingRequest } from "web3/queryVotingContractMethods";
import Button from "common/components/button";
import TextInput from "common/components/text-input";
import Modal from "common/components/modal";
import useModal from "common/hooks/useModal";
import Select from "common/components/select";
import { useVotingContract } from "hooks";
import {
  postCommitVotes,
  PostRevealData,
  revealVotes,
} from "web3/postVotingContractMethods";
import { ethers } from "ethers";
import web3 from "web3";
import { computeVoteHashAncillary, Request } from "common/tempUmaFunctions";
import toWeiSafe from "common/utils/web3/convertToWeiSafely";
import { useCurrentRoundId } from "hooks";
import { OnboardContext } from "common/context/OnboardContext";
import { formatVoteDataToCommit } from "./helpers";
import { EncryptedVote } from "web3/queryVotingContractEvents";
import EthCrypto from "eth-crypto";

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
  encryptedVotes: EncryptedVote[];
  refetchEncryptedVotes: Function;
}

interface TableValue {
  ancillaryData: string;
  identifier: string;
  vote: string;
}

const ActiveRequestsForm: FC<Props> = ({
  activeRequests,
  isConnected,
  publicKey,
  votePhase,
  encryptedVotes,
  refetchEncryptedVotes,
}) => {
  const [modalState, setModalState] = useState<
    "init" | "pending" | "success" | "error"
  >("init");

  const {
    state: { address, network, signer },
  } = useContext(OnboardContext);
  const { votingContract } = useVotingContract(signer, isConnected, network);
  // const { data } = useVotesCommittedEvents(votingContract, address);

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

      if (address) {
        // Format data.
        formatVoteDataToCommit(
          validValues,
          activeRequests,
          roundId,
          address,
          publicKey
        ).then((fd) => {
          console.log("fd", fd);
          if (votingContract) {
            postCommitVotes(votingContract, fd).then((tx) => {
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
      address,
      publicKey,
      roundId,
      votingContract,
      setModalState,
      refetchEncryptedVotes,
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
          (x) => x.identifier === el.identifier
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
        tv.push(datum);
      });
      setTableValues(tv);
    }
  }, [activeRequests, encryptedVotes]);

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
                    <p className="vote">{el.vote}</p>
                  </div>
                </td>
                <td>
                  <div>
                    {/* <UnlockedIcon /> */}
                    {votePhase === "Commit" && el.vote
                      ? "Committed"
                      : votePhase === "Commit" && !el.vote
                      ? "Uncommitted"
                      : null}
                    {votePhase === "Reveal" && el.vote
                      ? "Reveal"
                      : /* this is incorrect -- just wanna hide this string for now. */
                        null}
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
          {votePhase === "Commit" ? (
            <Button
              type="button"
              variant={
                Object.values(watchAllFields).filter((x) => x !== "").length
                  ? "secondary"
                  : "disabled"
              }
              onClick={(event) => {
                if (showModalSummary().length && votePhase === "Commit") open();
              }}
            >
              Commit Votes
            </Button>
          ) : null}
          {votePhase === "Reveal" ? (
            <Button
              type="button"
              onClick={() => {
                // WIP. Comment out for now.
                console.log("encryptedVotes", encryptedVotes);
                if (encryptedVotes.length && activeRequests.length) {
                  const postData = [] as PostRevealData[];
                  activeRequests.forEach((el, index) => {
                    const datum = {} as PostRevealData;
                    // I believe latest events are on bottom. requires testing.
                    const latestVotesFirst = [...encryptedVotes].reverse();
                    const findVote = latestVotesFirst.find(
                      (x) => x.identifier === el.identifier
                    );

                    if (findVote) {
                      datum.ancillaryData = el.ancillaryData;
                      // anc data is set to - or N/A in UI if empty, convert back to 0x.
                      if (
                        el.ancillaryData === "-" ||
                        el.ancillaryData === "N/A"
                      ) {
                        datum.ancillaryData = "0x";
                      } else {
                        datum.ancillaryData = web3.utils.utf8ToHex(
                          el.ancillaryData
                        );
                      }
                      datum.time = Number(el.time);
                      datum.identifier = el.idenHex;
                      datum.salt = findVote.salt;
                      // datum.price = toWeiSafe(findVote.price).toString();
                      datum.price = findVote.price.toString();
                      postData.push(datum);

                      if (address) {
                        const salt = "100";
                        const r: Request = {
                          price: datum.price,
                          salt,
                          account: address,
                          time: datum.time,
                          ancillaryData: datum.ancillaryData,
                          roundId: Number(roundId),
                          identifier: datum.identifier,
                        };
                        console.log("request in REVEAL", r);
                        const hash = computeVoteHashAncillary(r);

                        console.log("<<<REVEAL HASH>>>>", hash);
                      }
                    }
                  });
                  console.log("Post data", postData);
                  if (votingContract) {
                    revealVotes(votingContract, postData).then((res) => {
                      console.log("woot");
                    });
                  }
                }
              }}
              variant="secondary"
            >
              Reveal Votes
            </Button>
          ) : null}
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={close} ref={modalRef}>
        <StyledModal>
          <div className="icon-wrapper">
            {modalState === "pending" ? (
              <div className="modal__ico modal__ico-animate">
                <UnlockedIcon className="unlocked-icon" />

                <div className="modal__ico-container">
                  <div className="modal__ico-halfclip">
                    <div className="modal__ico-halfcircle modal__ico-clipped"></div>
                  </div>

                  <div className="modal__ico-halfcircle modal__ico-fixed"></div>
                </div>
              </div>
            ) : modalState === "success" ? (
              <LockedIconCommitted className="unlocked-icon" />
            ) : (
              <UnlockedIcon className="unlocked-icon" />
            )}
          </div>

          {modalState === "pending" ? (
            <h3 className="header">Committing Votes...</h3>
          ) : modalState === "success" ? (
            <h3 className="header">Votes successfully committed</h3>
          ) : (
            <h3 className="header">Ready to commit these votes?</h3>
          )}

          {showModalSummary().length
            ? showModalSummary().map((el, index) => {
                return (
                  <div className="vote-wrapper" key={index}>
                    <div>{el.identifier}</div>
                    <div>{el.value}</div>
                  </div>
                );
              })
            : null}
          <div
            className={`button-wrapper ${
              modalState === "pending" ? "pending" : ""
            }`}
          >
            {modalState === "init" ||
            modalState === "pending" ||
            modalState === "error" ? (
              <>
                <Button onClick={() => close()} variant="primary">
                  Not Yet
                </Button>
                <Button
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  variant="secondary"
                >
                  I'm Ready
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  // close modal and reset form values.
                  close();
                  reset();
                  setModalState("init");
                }}
                variant="secondary"
              >
                Done
              </Button>
            )}
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

        td:last-child {
          svg {
            margin: 0 auto;
          }
        }
      }
      .vote {
        margin: 0 auto;
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
    &.pending {
      opacity: 0.5;
      pointer-events: none;
    }
    margin-top: 1.5rem;
    text-align: center;

    width: 400px;
    button {
      margin: 0 0.5rem;
    }
  }

  // CSS for transition from mockup.
  .modal__ico {
    position: relative;
    /* display: inline-block; */
    margin-bottom: 24px;
  }

  .modal__ico-container {
    position: absolute;
    width: 86px;
    height: 86px;
    top: -23px;
    left: 157px;
  }

  .modal__ico-halfclip {
    width: 50%;
    height: 100%;
    right: 0px;
    position: absolute;
    overflow: hidden;
    transform-origin: left center;
    animation: cliprotate 4s steps(2) infinite;
  }

  .modal__ico-halfcircle {
    box-sizing: border-box;
    height: 100%;
    right: 0px;
    position: absolute;
    border: solid 2px transparent;
    border-top-color: #ff4a4a;
    border-left-color: #ff4a4a;
    border-radius: 50%;
  }

  .modal__ico-clipped {
    width: 200%;
    animation: rotate 2s linear infinite;
  }

  .modal__ico-fixed {
    width: 100%;
    transform: rotate(135deg);
    animation: showfixed 4s steps(2) infinite;
  }

  @keyframes cliprotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(-45deg);
    }
    100% {
      transform: rotate(135deg);
    }
  }

  @keyframes showfixed {
    0% {
      opacity: 0;
    }
    49.9% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }
`;

export default ActiveRequestsForm;
