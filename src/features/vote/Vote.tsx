/** @jsxImportSource @emotion/react */
import tw, { styled } from "twin.macro";

// Components
import Wallet from "./Wallet";
import ActiveRequests from "./ActiveRequests";

const Container = styled.div`
  background-color: #f5f5f5;
  ${tw`max-w-full pt-5 mt-5`};
`;

const Vote = () => {
  return (
    <Container>
      <Wallet />
      <ActiveRequests />
    </Container>
  );
};

export default Vote;
