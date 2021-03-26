/** @jsxImportSource @emotion/react */
import tw, { styled } from "twin.macro";

// Components
import Wallet from "./Wallet";
import ActiveRequests from "./ActiveRequests";
import useVoteData from "common/hooks/useVoteData";

const Container = styled.div`
  background-color: #f5f5f5;
  ${tw`max-w-full pt-5 mt-5`};
  font-family: "Halyard Display";
`;

const Vote = () => {
  useVoteData();
  return (
    <Container>
      <Wallet />
      <ActiveRequests />
    </Container>
  );
};

export default Vote;
