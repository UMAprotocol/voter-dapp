/** @jsxImportSource @emotion/react */
import { useState, useEffect, useContext } from "react";
import tw, { styled } from "twin.macro";
import { ethers } from "ethers";

// Components
import ActiveRequests from "./ActiveRequests";
import PastRequests from "./PastRequests";
import { PriceRound } from "web3/queryVotingContractEvents";
import {
  useEncryptedVotesEvents,
  usePriceRoundEvents,
  usePriceResolvedEvents,
  useRewardsRetrievedEvents,
  useVotesCommittedEvents,
  useVotesRevealedEvents,
} from "./hooks";
import { OnboardContext } from "common/context/OnboardContext";
import createVotingContractInstance from "web3/createVotingContractInstance";
import { isActiveRequest } from "./helpers";

const Vote = () => {
  const { state } = useContext(OnboardContext);
  const [votingContract, setVotingContract] = useState<ethers.Contract | null>(
    null
  );
  const [activeRequests, setActiveRequests] = useState<PriceRound[]>([]);
  const [address, setAddress] = useState<string | null>(null);

  // This is determined before a user connects.
  const { priceRounds } = usePriceRoundEvents();
  // console.log("PR", priceRounds);

  // This data is determined after a user connects.
  const [encryptedVotes] = useEncryptedVotesEvents(
    votingContract,
    state.address
  );
  const [priceResolved] = usePriceResolvedEvents(votingContract);
  const [rewardsRetrieved] = useRewardsRetrievedEvents(votingContract, address);
  const [votesCommitted] = useVotesCommittedEvents(votingContract, address);
  const [votesRevealed] = useVotesRevealedEvents(votingContract, address);

  useEffect(() => {
    setAddress(state.address);
  }, [state.address]);

  useEffect(() => {
    // If connected, try to create contract with assigned signer.
    if (state.isConnected) {
      // Signer can be null check for null and if we've already defined a contract.
      if (state.signer && !votingContract) {
        const contract = createVotingContractInstance(state.signer);
        setVotingContract(contract);
      }
    }
  }, [state.isConnected, state.signer, state.address, votingContract]);

  // Once priceRounds are pulled from contract, filter them into requests.
  useEffect(() => {
    if (priceRounds.length) {
      const ar = priceRounds.filter(isActiveRequest);
      setActiveRequests(ar);
    }
  }, [priceRounds]);

  return (
    <StyledVote>
      <ActiveRequests activeRequests={activeRequests} />
      {/* <PastRequests
        priceRounds={priceRounds}
        address={address}
        votesCommitted={votesCommitted}
        encryptedVotes={encryptedVotes}
        votesRevealed={votesRevealed}
        rewardsRetrieved={rewardsRetrieved}
        priceResolved={priceResolved}
      /> */}
    </StyledVote>
  );
};

const StyledVote = styled.div`
  background-color: #f5f5f5;
  ${tw`max-w-full pt-5 pb-1`};
  font-family: "Halyard Display";
`;

export default Vote;
