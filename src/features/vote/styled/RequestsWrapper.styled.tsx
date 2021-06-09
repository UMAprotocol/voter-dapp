/** @jsxImportSource @emotion/react */
import tw, { styled } from "twin.macro"; // eslint-disable-line

// Past and Upcoming have the same wrapper styles.
export const RequestsWrapper = styled.div`
  font-family: "Halyard Display";
  background-color: #fff;
  ${tw`max-w-7xl mx-auto py-5 my-10 mb-10`};
  .bottom-row {
    text-align: center;
    button {
      width: 150px;
    }
  }
  .loading {
    padding: 2rem;
    font-size: 1.5rem;
    margin-left: 2rem;
    font-weight: 600;
  }
`;

export default RequestsWrapper;
