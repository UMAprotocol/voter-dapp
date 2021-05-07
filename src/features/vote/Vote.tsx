/** @jsxImportSource @emotion/react */
import { useContext, useEffect, useState } from "react";
import tw, { styled } from "twin.macro";
import { DateTime } from "luxon";

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
  useCurrentRoundId,
  useVotesRevealedEvents,
  useEncryptedVotesEvents,
} from "hooks";
import { recoverPublicKey } from "./helpers/recoverPublicKey";
import { derivePrivateKey } from "./helpers/derivePrivateKey";

import { PriceRequestAdded } from "web3/get/queryPriceRequestAddedEvents";
// import usePrevious from "common/hooks/usePrevious";

const Vote = () => {
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [upcomingRequests, setUpcomingRequests] = useState<PriceRequestAdded[]>(
    []
  );
  const { state } = useContext(OnboardContext);

  const { data: voteSummaryData } = useVoteData();

  const { votingAddress, hotAddress } = useVotingAddress(
    state.address,
    state.signer,
    state.network
  );

  const { votingContract } = useVotingContract(
    state.signer,
    state.isConnected,
    state.network,
    votingAddress,
    hotAddress
  );

  const { data: priceRequestsAdded } = usePriceRequestAddedEvents();
  const { data: activeRequests } = usePendingRequests();
  const { data: roundId } = useCurrentRoundId();

  const { data: revealedVotes } = useVotesRevealedEvents(
    votingContract,
    votingAddress
  );

  const {
    data: encryptedVotes,
    refetch: refetchEncryptedVotes,
  } = useEncryptedVotesEvents(
    votingContract,
    votingAddress,
    privateKey,
    roundId
  );

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

  useEffect(()=>{
    // address changed, remove these keys
    setPrivateKey("");
    setPublicKey("");
  },[state.address])

  useEffect(() => {
    // address changed, remove these keys
    setPrivateKey("");
    setPublicKey("");
  }, [state.address]);

  useEffect(() => {
    if (priceRequestsAdded.length) {
      const filtered = priceRequestsAdded.filter((el) => {
        const startOfRequests = DateTime.fromSeconds(Number(el.time));
        const now = DateTime.local();
        const diff = startOfRequests.diff(now).toObject().milliseconds;
        if (diff) {
          // if time is greater than the current time, request is upcoming.
          return diff > 0;
        } else {
          return false;
        }
      });
      setUpcomingRequests(filtered);
    }
  }, [priceRequestsAdded]);

  return (
    <StyledVote>
      {activeRequests.length ? (
        <ActiveRequests
          activeRequests={activeRequests}
          publicKey={publicKey}
          privateKey={privateKey}
          roundId={roundId}
          encryptedVotes={encryptedVotes}
          refetchEncryptedVotes={refetchEncryptedVotes}
          revealedVotes={revealedVotes}
          votingAddress={votingAddress}
          hotAddress={hotAddress}
        />
      ) : null}

      <PastRequests
        voteSummaryData={voteSummaryData}
        address={votingAddress}
        contract={votingContract}
        roundId={roundId}
      />
      {upcomingRequests.length ? (
        <UpcomingRequests upcomingRequests={upcomingRequests} />
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
