/** @jsxImportSource @emotion/react */
import tw, { styled } from "twin.macro";

const Container = styled.div`
  ${tw`max-w-4xl mx-auto p-5 mt-5`}
`;

const Vote = () => {
  return (
    <Container>
      <h1 tw="text-blue-500 text-4xl">Vote Page</h1>
    </Container>
  );
};

export default Vote;
