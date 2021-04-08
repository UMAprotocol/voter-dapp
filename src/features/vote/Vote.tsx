/** @jsxImportSource @emotion/react */
import { useState, useEffect, useContext } from "react";
import tw, { styled } from "twin.macro";

// Components
import ActiveRequests from "./ActiveRequests";
import PastRequests from "./PastRequests";
import { PriceRound } from "web3/queryVotingContractEvents";
import { usePriceRoundEvents } from "hooks";
import useVoteData from "common/hooks/useVoteData";
import { OnboardContext } from "common/context/OnboardContext";
import { useVotingAddress, useVotingContract } from "hooks";
import { isActiveRequest } from "./helpers";

const Vote = () => {
  const { state } = useContext(OnboardContext);
  // const [activeRequests, setActiveRequests] = useState<PriceRound[]>([]);

  // This is determined before a user connects.
  const { data: priceRoundsEvents } = usePriceRoundEvents();

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

  // // Once priceRounds are pulled from contract, filter them into requests.
  // useEffect(() => {
  //   if (priceRoundsEvents.length) {
  //     const ar = priceRoundsEvents.filter(isActiveRequest);
  //     setActiveRequests(ar);
  //   }
  // }, [priceRoundsEvents]);

  return (
    <StyledVote>
      <ActiveRequests
      // activeRequests={activeRequests}
      />
      <PastRequests
        priceRounds={priceRequestRounds}
        address={votingAddress}
        contract={votingContract}
      />
    </StyledVote>
  );
};

const StyledVote = styled.div`
  background-color: #f5f5f5;
  ${tw`max-w-full pt-5 pb-1`};
  font-family: "Halyard Display";
`;

export default Vote;
