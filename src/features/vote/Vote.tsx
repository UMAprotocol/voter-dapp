/** @jsxImportSource @emotion/react */
import { useContext, useEffect, useState, FC } from "react";
import tw, { styled } from "twin.macro";
import { DateTime } from "luxon";

// Components
import ActiveRequests from "./ActiveRequests";
import PastRequests from "./PastRequests";
import UpcomingRequests from "./UpcomingRequests";

import useVoteData, { PriceRequestRound } from "common/hooks/useVoteData";
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

import { PriceRequestAdded } from "web3/get/queryPriceRequestAddedEvents";
import { PendingRequest } from "web3/get/queryGetPendingRequests";
import { VoteRevealed } from "web3/get/queryVotesRevealedEvents";
import { EncryptedVote } from "web3/get/queryEncryptedVotesEvents";
import { SigningKeys } from "App";
import { ethers } from "ethers";
import currentSigningMessage from "common/currentSigningMessage";

interface Props {
  signingKeys: SigningKeys;
}

const Vote: FC<Props> = ({ signingKeys }) => {
  const [upcomingRequests, setUpcomingRequests] = useState<PriceRequestAdded[]>(
    []
  );

  const { state } = useContext(OnboardContext);

  const { data: voteSummaryData = [] as PriceRequestRound[] } = useVoteData();

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

  const { data: priceRequestsAdded = [] as PriceRequestAdded[] } =
    usePriceRequestAddedEvents();
  const { data: activeRequests = [] as PendingRequest[] } =
    usePendingRequests();
  const { data: roundId = "", refetch: refetchRoundId } = useCurrentRoundId();

  const {
    data: revealedVotes = [] as VoteRevealed[],
    refetch: refetchVoteRevealedEvents,
  } = useVotesRevealedEvents(votingContract, votingAddress);

  const message = currentSigningMessage(Number(roundId));
  const hashedMessage = ethers.utils.formatBytes32String(message);

  const signingPK =
    hotAddress &&
    signingKeys[hashedMessage] &&
    signingKeys[hashedMessage][hotAddress]
      ? signingKeys[hashedMessage][hotAddress].privateKey
      : votingAddress &&
        signingKeys[hashedMessage] &&
        signingKeys[hashedMessage][votingAddress]
      ? signingKeys[hashedMessage][votingAddress].privateKey
      : "";

  const {
    data: encryptedVotes = [] as EncryptedVote[],
    refetch: refetchEncryptedVotes,
  } = useEncryptedVotesEvents(
    votingContract,
    votingAddress,
    signingPK,
    roundId
  );

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
          signingKeys={signingKeys}
          roundId={roundId}
          refetchRoundId={refetchRoundId}
          encryptedVotes={encryptedVotes}
          refetchEncryptedVotes={refetchEncryptedVotes}
          revealedVotes={revealedVotes}
          refetchVoteRevealedEvents={refetchVoteRevealedEvents}
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
