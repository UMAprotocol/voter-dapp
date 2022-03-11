/** @jsxImportSource @emotion/react */
import tw, { styled } from "twin.macro"; // eslint-disable-line

export const ModalWrapper = styled.div`
  /* max-width: 700; */
  min-width: 450px;
  overflow-y: auto;
  height: auto;
  position: relative;
  background-color: #fff;
  z-index: 1;
  border-radius: 12px;
  margin: 0.5rem 1rem 1rem;
  outline: 0;
  box-sizing: border-box;
  font-family: "Halyard Display";
  border: none;
  max-width: 700px;
  max-height: 80vh;
  .header {
    text-align: center;
    margin-bottom: 1rem;
    font-weight: 600;
    font-size: 1.25rem;
  }
  .header-body {
    border-color: #e5e5e5;
    padding-bottom: 4rem;
  }
`;

export const MiniHeader = styled.div`
  color: #ff4a4a;
  font-size: 0.8rem;
  margin-bottom: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  .copy-wrapper {
    display: inline;
    color: #ff4a4a;

    &:hover {
      color: #000;
    }
  }
  .copy-wrapper {
    cursor: pointer;
  }
`;

export const Proposal = styled.div`
  font-size: 1.5rem;
  font-weight: 500;
  color: #000;
  margin-bottom: 1rem;
  max-width: 600px;
  padding-bottom: 1rem;
`;

export const Description = styled.div`
  line-height: 1.71rem;
  color: grey;
  max-width: 500px;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
`;

export const IconsWrapper = styled.div`
  padding: 1rem 0 2rem;
  border-bottom: 1px solid #e4e5e4;
  margin-bottom: 2rem;
  display: flex;
`;

export const IconsItem = styled.div`
  flex-grow: 1;
  a,
  .copy-wrapper {
    display: flex;
    max-width: 200px;
    color: #ff4a4a;
    &:hover {
      text-decoration: underline;
    }
  }
  .copy-wrapper {
    cursor: pointer;
  }
  padding-bottom: 1rem;
`;

export const Icon = styled.div`
  display: inline-block;
  margin-right: 12px;
  border: 1px solid #ff4a4a;
  border-radius: 20px;
  padding: 6px;
  svg {
    margin-bottom: 2px;
  }
`;

export const StateValue = styled.div`
  padding: 0.5rem 0 1rem;
  border-bottom: 1px solid #e4e5e4;
  color: #000;
  font-size: 1.5rem;
  padding-bottom: 1rem;
`;

export const StateValueAddress = styled(StateValue)`
  border-bottom: none;
`;

export const StateValueAncData = styled(StateValue)`
  max-width: 400px;
  word-wrap: break-word;
`;
export const RevealHeader = styled.div`
  font-size: 0.75rem;
  color: #000;
  font-weight: 600;
`;

export const RevealPercentage = styled.div`
  font-size: 0.75rem;
  color: #000;
  border-bottom: 1px solid #e4e5e4;
  padding-bottom: 1rem;
`;

export const LastStateValue = styled(StateValue)`
  padding-bottom: 3rem;
  display: flex;
  max-width: 100%;
  font-size: 0.75rem;
  div {
    justify-content: space-between;
    color: grey;
    &:nth-child(2) {
      padding-left: 1rem;
      flex-grow: 1;
      max-width: 300px;
      word-break: break-word;
    }
  }
`;
