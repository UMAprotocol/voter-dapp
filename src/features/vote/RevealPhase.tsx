import {
  FC,
  useState,
  useContext,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import tw from "twin.macro"; // eslint-disable-line
import web3 from "web3";
import { Wrapper } from "./styled/RevealPhase.styled";
import Button from "common/components/button";
import { EncryptedVote } from "web3/get/queryEncryptedVotesEvents";
import { PendingRequest } from "web3/get/queryGetPendingRequests";
import { revealVotes, PostRevealData } from "web3/post/revealVotes";
import { useVotingContract } from "hooks";
import { OnboardContext } from "common/context/OnboardContext";
import { Round } from "web3/get/queryRounds";
import { getMessageSignatureMetamask } from "common/tempUmaFunctions";
import { snapshotCurrentRound } from "web3/post/snapshotCurrentRound";
import { VoteRevealed } from "web3/get/queryVotesRevealedEvents";
import { ethers } from "ethers";
import { ModalState } from "./ActiveRequests";
import { DateTime } from "luxon";

interface Props {
  isConnected: boolean;
  encryptedVotes: EncryptedVote[];
  activeRequests: PendingRequest[];
  hotAddress: string | null;
  votingAddress: string | null;
  round: Round;
  revealedVotes: VoteRevealed[];
  refetchEncryptedVotes: Function;
  setViewDetailsModalState: Dispatch<SetStateAction<ModalState>>;
  openViewDetailsModal: () => void;
}

interface TableValue {
  ancillaryData: string;
  identifier: string;
  vote: string;
  revealed: boolean;
  ancHex: string;
  timestamp: string;
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
  setViewDetailsModalState,
  openViewDetailsModal,
}) => {
  const [tableValues, setTableValues] = useState<TableValue[]>([]);
  const [postRevealData, setPostRevealData] = useState<PostRevealData[]>([]);

  const {
    state: { network, signer, provider },
  } = useContext(OnboardContext);

  const { votingContract, designatedVotingContract } = useVotingContract(
    signer,
    isConnected,
    network,
    votingAddress,
    hotAddress
  );

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
          timestamp: DateTime.fromSeconds(Number(el.time)).toLocaleString({
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h24",
            timeZoneName: "short",
          }),
        };
      });

      setTableValues(tv);
    }
    if (activeRequests.length && encryptedVotes.length) {
      const tv = [] as TableValue[];
      const postData = [] as PostRevealData[];
      // I believe latest events are on bottom. requires testing.
      const latestVotesFirst = [...encryptedVotes].reverse();
      activeRequests.forEach((el) => {
        const datum = {} as TableValue;
        datum.ancillaryData = el.ancillaryData;
        datum.identifier = el.identifier;
        let vote = "-";
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

        datum.timestamp = DateTime.fromSeconds(Number(el.time)).toLocaleString({
          month: "short",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h24",
          timeZoneName: "short",
        });

        tv.push(datum);

        // Gather up PostRevealData here to save complexity
        const prd = {} as PostRevealData;

        if (findVote && !findReveal) {
          prd.ancillaryData = el.ancillaryData;
          // anc data is set to - or N/A in UI if empty, convert back to 0x.
          if (
            el.ancillaryData === UNDEFINED_VOTE ||
            el.ancillaryData === "N/A"
          ) {
            prd.ancillaryData = "0x";
          } else {
            prd.ancillaryData = web3.utils.utf8ToHex(el.ancillaryData);
          }
          prd.time = Number(el.time);
          prd.identifier = el.idenHex;
          prd.salt = findVote.salt;
          // datum.price = toWeiSafe(findVote.price).toString();
          prd.price = findVote.price.toString();
          postData.push(prd);
        }
      });

      setTableValues(tv);
      setPostRevealData(postData);
    }
  }, [activeRequests, encryptedVotes, revealedVotes, setPostRevealData]);

  return (
    <Wrapper className="RequestPhase" isConnected={isConnected}>
      <table className="table">
        <thead>
          <tr>
            <th>Requested Vote</th>
            <th>Description</th>
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
                  <div className="description">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Curabitur sed eleifend erat. Duis in ante nisi. Donec ut
                    nibh id justo faucibus fermentum id id ex. Mauris
                    sollicitudin consequat neque.
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
                if (vc) {
                  revealVotes(vc, postRevealData).then((res) => {
                    // refetch votes.
                    refetchEncryptedVotes();
                    setPostRevealData([]);
                  });
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
          {activeRequests.length && round.snapshotId === "0" ? (
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
                                console.log("success?", tx);
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
          ) : null}
        </div>
      </div>
    </Wrapper>
  );
};

const UNDEFINED_VOTE = "-";

export default RevealPhase;
