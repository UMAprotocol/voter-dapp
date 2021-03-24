/** @jsxImportSource @emotion/react */
import tw, { styled } from "twin.macro";

// Components
import Wallet from "./Wallet";

const Container = styled.div`
  background-color: #f5f5f5;
  ${tw`max-w-full p-10 mt-5`};
`;

const Vote = () => {
  return (
    <Container>
      <Wallet />
    </Container>
  );
};

export default Vote;
