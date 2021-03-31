/** @jsxImportSource @emotion/react */
import { useState, useEffect, useContext } from "react";
import tw, { styled } from "twin.macro";
import { ethers } from "ethers";
import { DateTime } from "luxon";

// Components
import Wallet from "./Wallet";
import ActiveRequests from "./ActiveRequests";
import useVotingEvents, { PriceRound } from "./useVotingEvents";
import { ConnectionContext } from "common/context/ConnectionContext";
import createVotingContractInstance from "common/utils/web3/createVotingContractInstance";

const Vote = () => {
  const context = useContext(ConnectionContext);
  const [votingContract, setVotingContract] = useState<ethers.Contract | null>(
    null
  );
  const [activeRequests, setActiveRequests] = useState<PriceRound[]>([]);
  const [, setPastRequests] = useState<PriceRound[]>([]);
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
      <Wallet />
      <ActiveRequests activeRequests={activeRequests} />
    </StyledVote>
  );
};

function isActiveRequest(round: PriceRound) {
  const currentTime = DateTime.local();
  const roundTime = DateTime.fromSeconds(Number(round.time));
  const diff = currentTime.diff(roundTime, ["days"]).toObject();
  const { days } = diff;
  if (days) {
    return days > 0 && days <= ACTIVE_DAYS_CONSTANT ? true : false;
  } else {
    return false;
  }
}

const ACTIVE_DAYS_CONSTANT = 2.5;

function isPastRequest(round: PriceRound) {
  const currentTime = DateTime.local();
  const roundTime = DateTime.fromSeconds(Number(round.time));
  const diff = currentTime.diff(roundTime, ["days"]).toObject();
  const { days } = diff;
  if (days) {
    return days > 0 && days > ACTIVE_DAYS_CONSTANT ? true : false;
  } else {
    return false;
  }
}

const StyledVote = styled.div`
  background-color: #f5f5f5;
  ${tw`max-w-full pt-5 mt-5`};
  font-family: "Halyard Display";
`;

export default Vote;
