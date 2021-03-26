/** @jsxImportSource @emotion/react */
import tw, { styled } from "twin.macro";

// Components
import Wallet from "./Wallet";
import ActiveRequests from "./ActiveRequests";
import useVoteData from "common/hooks/useVoteData";

const Vote = () => {
  const { roundVoteData } = useVoteData();
  console.log("roundVoteData", roundVoteData);
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
