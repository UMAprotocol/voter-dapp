/** @jsxImportSource @emotion/react */
import { useState, useEffect, useContext } from "react";
import tw, { styled } from "twin.macro";
import { ethers } from "ethers";

// Components
import ActiveRequests from "./ActiveRequests";
import PastRequests from "./PastRequests";
import useVotingEvents, { PriceRound } from "./useVotingEvents";
import { ConnectionContext } from "common/context/ConnectionContext";
import createVotingContractInstance from "common/utils/web3/createVotingContractInstance";
import { isActiveRequest, isPastRequest } from "./helpers";

const Vote = () => {
  const context = useContext(ConnectionContext);
  const [votingContract, setVotingContract] = useState<ethers.Contract | null>(
    null
  );
  const [activeRequests, setActiveRequests] = useState<PriceRound[]>([]);
  const [pastRequests, setPastRequests] = useState<PriceRound[]>([]);
  const { priceRounds } = useVotingEvents(votingContract);

  useEffect(() => {
    // If connected, try to create contract with assigned signer.
    if (context.state.isConnected) {
      // Signer can be null check for null and if we've already defined a contract.
      if (context.state.signer && !votingContract) {
        const contract = createVotingContractInstance(context.state.signer);
        setVotingContract(contract);
      }
    }
  }, [context.state.isConnected, context.state.signer, votingContract]);

  // Once priceRounds are pulled from contract, filter them into requests.
  useEffect(() => {
    if (priceRounds.length) {
      const ar = priceRounds.filter(isActiveRequest);
      const pr = priceRounds.filter(isPastRequest);
      setActiveRequests(ar);
      setPastRequests(pr);
    }
  }, [priceRounds]);

  return (
    <StyledVote>
      <ActiveRequests activeRequests={activeRequests} />
      <PastRequests pastRequests={pastRequests} />
    </StyledVote>
  );
};

const StyledVote = styled.div`
  background-color: #f5f5f5;
  ${tw`max-w-full pt-5 pb-1`};
  font-family: "Halyard Display";
`;

export default Vote;
