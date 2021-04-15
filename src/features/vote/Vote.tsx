/** @jsxImportSource @emotion/react */
import { useContext, useEffect, useState } from "react";
import tw, { styled } from "twin.macro";

// Components
import ActiveRequests from "./ActiveRequests";
import PastRequests from "./PastRequests";
import UpcomingRequests from "./UpcomingRequests";

import useVoteData from "common/hooks/useVoteData";
import { OnboardContext } from "common/context/OnboardContext";
import {
  usePriceRequestAddedEvents,
  useVotingAddress,
  useVotingContract,
  usePendingRequests,
} from "hooks";
import { recoverPublicKey, derivePrivateKey } from "./helpers";

const Vote = () => {
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const { state } = useContext(OnboardContext);

  const { data: priceRequestRounds } = useVoteData();

  const { votingAddress } = useVotingAddress(
    state.address,
    state.signer,
    state.network
  );

  const { votingContract } = useVotingContract(
    state.signer,
    state.isConnected,
    state.network
  );

  const { data: priceRequestsAdded } = usePriceRequestAddedEvents();
  const { data: activeRequests } = usePendingRequests();

  useEffect(() => {
    if (state.signer) {
      const message = "Login to UMA Voter dApp";
      state.signer
        .signMessage(message)
        .then((msg) => {
          const privateKey = derivePrivateKey(msg);
          const publicKey = recoverPublicKey(privateKey);
          setPrivateKey(privateKey.substr(2));
          setPublicKey(publicKey);
        })
        .catch((err) => {
          console.log("Sign failed");
        });
    }
  }, [state.signer]);

  return (
    <StyledVote>
      {activeRequests.length ? (
        <ActiveRequests
          activeRequests={activeRequests}
          publicKey={publicKey}
          privateKey={privateKey}
        />
      ) : null}

      <PastRequests
        priceRounds={priceRequestRounds}
        address={votingAddress}
        contract={votingContract}
      />
      {priceRequestsAdded.length ? (
        <UpcomingRequests priceRequestsAdded={priceRequestsAdded} />
      ) : null}
    </StyledVote>
  );
};

const StyledVote = styled.div`
  background-color: #f5f5f5;
  ${tw`max-w-full pt-5 pb-1`};
  font-family: "Halyard Display";
`;

export default Vote;
