import { FC, useState, useContext } from "react";
import web3 from "web3";
import { FormWrapper } from "./styled/ActiveRequestsForm.styled";
import Button from "common/components/button";
import { EncryptedVote } from "web3/get/queryEncryptedVotesEvents";
import { PendingRequest } from "web3/get/queryGetPendingRequests";
import { revealVotes, PostRevealData } from "web3/post/revealVotes";
import { useVotingContract } from "hooks";
import { OnboardContext } from "common/context/OnboardContext";
import { Round } from "web3/get/queryRounds";
import { getMessageSignatureMetamask } from "common/tempUmaFunctions";
import { snapshotCurrentRound } from "web3/post/snapshotCurrentRound";

interface Props {
  isConnected: boolean;
  votePhase: string;
  encryptedVotes: EncryptedVote[];
  activeRequests: PendingRequest[];
  hotAddress: string | null;
  votingAddress: string | null;
  round: Round;
}

interface TableValue {
  ancillaryData: string;
  identifier: string;
  vote: string;
  revealed: boolean;
  ancHex: string;
}

const RevealPhase: FC<Props> = ({
  isConnected,
  votePhase,
  encryptedVotes,
  activeRequests,
  votingAddress,
  hotAddress,
  round,
}) => {
  const [tableValues, setTableValues] = useState<TableValue[]>([]);
  const [canReveal, setCanReveal] = useState(false);
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

  return (
    <FormWrapper className="RevealPhase" isConnected={isConnected}>
      <table className="table">
        <thead>
          <tr>
            <th>Requested Vote</th>
            {/* Commented out for now -- might move the anc data elsewhere */}
            {/* <th>Proposal Detail</th> */}
            <th>Description</th>
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
                {/* Commented out for now -- might move the anc data elsewhere */}
                {/* <td>{el.ancillaryData}</td> */}
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
                  <div>
                    {votePhase === "Reveal" && el.revealed
                      ? "Revealed"
                      : votePhase === "Reveal" &&
                        el.vote !== UNDEFINED_VOTE &&
                        !el.revealed
                      ? "Reveal"
                      : votePhase === "Reveal" && el.vote === UNDEFINED_VOTE
                      ? "Uncommitted"
                      : null}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="end-row">
        {/* <div className="end-row-item">
        Need to enable two key voting? Click here.
      </div> */}
        <div className="end-row-item">
          {votePhase === "Reveal" && canReveal ? (
            <Button
              type="button"
              onClick={() => {
                // WIP. Comment out for now.
                // console.log("encryptedVotes", encryptedVotes);
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
                        el.ancillaryData === UNDEFINED_VOTE ||
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
                    }
                  });
                  // console.log("Post data", postData);

                  // Make sure to use the two key contract for revealing if it exists
                  let vc = votingContract;
                  if (designatedVotingContract) vc = designatedVotingContract;
                  if (vc) {
                    revealVotes(vc, postData).then((res) => {
                      console.log("woot");
                    });
                  }
                }
              }}
              variant="secondary"
            >
              Reveal Votes
            </Button>
          ) : votePhase === "Reveal" && !canReveal ? (
            <Button type="button" variant="disabled">
              Reveal Votes
            </Button>
          ) : null}
          {activeRequests.length &&
          votePhase === "Reveal" &&
          round.snapshotId === "0" ? (
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
    </FormWrapper>
  );
};

const UNDEFINED_VOTE = "-";

export default RevealPhase;
