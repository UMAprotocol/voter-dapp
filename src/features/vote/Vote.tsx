/** @jsxImportSource @emotion/react */
import { useState, useEffect } from "react";
import tw, { styled } from "twin.macro";

// Components
import Wallet from "./Wallet";
import ActiveRequests from "./ActiveRequests";
import useVoteData from "common/hooks/useVoteData";
import {
  FormattedPriceRequestRound,
  formatPriceRoundTime,
} from "common/helpers/formatPriceRequestRounds";

const Vote = () => {
  const [activeRequests, setActiveRequests] = useState<
    FormattedPriceRequestRound[]
  >([]);
  const [pastRequests, setPastRequests] = useState<
    FormattedPriceRequestRound[]
  >([]);
  const [upcomingRequests, setUpcomingRequests] = useState<
    FormattedPriceRequestRound[]
  >([]);

  const { roundVoteData } = useVoteData();
  console.log("roundVoteData", roundVoteData);

  useEffect(() => {
    // After queried, filter rounds into past, current, future.
    if (Object.keys(roundVoteData).length) {
      const pr: FormattedPriceRequestRound[] = Object.values(
        roundVoteData
      ).filter((el) => el.time < Date.now() / 1000);

      setPastRequests(pr);
    }
  }, [roundVoteData, setActiveRequests, setPastRequests, setUpcomingRequests]);

  return (
    <StyledVote>
      <Wallet />
      <ActiveRequests activeRequests={activeRequests} />
    </StyledVote>
  );
};

const StyledVote = styled.div`
  background-color: #f5f5f5;
  ${tw`max-w-full pt-5 mt-5`};
  font-family: "Halyard Display";
`;

export default Vote;
