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
import useVoteData from "common/hooks/useVoteData";
import { OnboardContext } from "common/context/OnboardContext";
import createVotingContractInstance from "web3/createVotingContractInstance";
import { isActiveRequest } from "./helpers";
import createDesignatedVotingContractInstance from "common/utils/web3/createDesignatedVotingContractInstance";

const Vote = () => {
  const { state } = useContext(OnboardContext);
  const [votingContract, setVotingContract] = useState<ethers.Contract | null>(
    null
  );
  const [activeRequests, setActiveRequests] = useState<PriceRound[]>([]);
  const [votingAddress, setVotingAddress] = useState<string | null>(null);
  const [, setHotAddress] = useState<string | null>(null);
  // This is determined before a user connects.
  const { priceRounds } = usePriceRoundEvents();

  // This data is determined after a user connects.
  const { data: encryptedVotes } = useEncryptedVotesEvents(
    votingContract,
    votingAddress
  );
  const { data: priceResolved } = usePriceResolvedEvents(votingContract);
  const { data: rewardsRetrieved } = useRewardsRetrievedEvents(
    votingContract,
    votingAddress
  );
  const { data: votesCommitted } = useVotesCommittedEvents(
    votingContract,
    votingAddress
  );
  const { data: votesRevealed } = useVotesRevealedEvents(
    votingContract,
    votingAddress
  );

  const { data: priceRequestRounds } = useVoteData();

  // Need to determine if user is using a two key contract.
  useEffect(() => {
    if (state.address && state.signer) {
      const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

      const designatedContract = createDesignatedVotingContractInstance(
        state.signer
      );
      designatedContract
        .designatedVotingContracts(state.address)
        .then((res: string) => {
          if (res === NULL_ADDRESS) {
            setVotingAddress(state.address);
          } else {
            setVotingAddress(res);
            setHotAddress(state.address);
          }
        });
    }
    setVotingAddress(state.address);
  }, [state.address, state.signer]);

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
      <PastRequests
        priceRounds={priceRequestRounds}
        address={votingAddress}
        contract={votingContract}
        votesCommitted={votesCommitted}
        encryptedVotes={encryptedVotes}
        votesRevealed={votesRevealed}
        rewardsRetrieved={rewardsRetrieved}
        priceResolved={priceResolved}
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
