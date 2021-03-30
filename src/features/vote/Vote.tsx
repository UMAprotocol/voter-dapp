/** @jsxImportSource @emotion/react */
import { useState, useEffect, useContext } from "react";
import tw, { styled } from "twin.macro";
import { ethers } from "ethers";

// Components
import Wallet from "./Wallet";
import ActiveRequests from "./ActiveRequests";
import useVoteData from "common/hooks/useVoteData";
import usePriceRounds from "./usePriceRounds";
import { ConnectionContext } from "common/context/ConnectionContext";
import createVotingContractInstance from "common/utils/web3/createVotingContractInstance";

const Vote = () => {
  const context = useContext(ConnectionContext);
  const [votingContract, setVotingContract] = useState<ethers.Contract | null>(
    null
  );
  usePriceRounds(votingContract);

  useEffect(() => {
    // If connected, try to create contract with assigned signer.
    if (context.state.isConnected) {
      // Signer can be null check for null and if we've already defined a contract.
      if (context.state.signer && !votingContract) {
        const contract = createVotingContractInstance(context.state.signer);
        setVotingContract(contract);
      }
    }
  }, [context.state.isConnected]);
  // const [activeRequests, setActiveRequests] = useState<
  //   FormattedPriceRequestRound[]
  // >([]);
  // const [pastRequests, setPastRequests] = useState<
  //   FormattedPriceRequestRound[]
  // >([]);
  // const [upcomingRequests, setUpcomingRequests] = useState<
  //   FormattedPriceRequestRound[]
  // >([]);

  const { roundVoteData } = useVoteData();

  // useEffect(() => {
  //   // After queried, filter rounds into past, current, future.
  //   if (Object.keys(roundVoteData).length) {
  //     const pr: FormattedPriceRequestRound[] = Object.values(
  //       roundVoteData
  //     ).filter((el) => el.time < Date.now() / 1000);

  //     setPastRequests(pr);
  //   }
  // }, [roundVoteData, setActiveRequests, setPastRequests, setUpcomingRequests]);

  return (
    <StyledVote>
      <Wallet />
      <ActiveRequests />
    </StyledVote>
  );
};

const StyledVote = styled.div`
  background-color: #f5f5f5;
  ${tw`max-w-full pt-5 mt-5`};
  font-family: "Halyard Display";
`;

export default Vote;
