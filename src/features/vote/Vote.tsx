/** @jsxImportSource @emotion/react */
import { useContext, useEffect, useState, FC } from "react";
import tw, { styled } from "twin.macro";

// Components
import ActiveRequests from "./ActiveRequests";
import PastRequests from "./PastRequests";
import UpcomingRequests from "./UpcomingRequests";

import { PriceRequestRound } from "common/hooks/useVoteData";
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
import getSigningKeys from "common/helpers/getSigningKeys";

interface Props {
  signingKeys: SigningKeys;
  voteSummaryData: PriceRequestRound[];
}

const Vote: FC<Props> = ({ signingKeys, voteSummaryData }) => {
  const [upcomingRequests, setUpcomingRequests] = useState<PriceRequestAdded[]>(
    []
  );

  const { state } = useContext(OnboardContext);

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

  const signingPK = getSigningKeys(
    signingKeys,
    hotAddress ? hotAddress : votingAddress
  ).privateKey;

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
      const filtered = priceRequestsAdded.filter(
        (el) => Number(el.roundId) > Number(roundId)
      );
      setUpcomingRequests(filtered);
    }
  }, [priceRequestsAdded, roundId]);

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
  ${tw`max-w-full pb-3`};
  font-family: "Halyard Display";
`;

export default Vote;
