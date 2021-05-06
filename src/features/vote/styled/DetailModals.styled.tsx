/** @jsxImportSource @emotion/react */
import tw, { styled } from "twin.macro"; // eslint-disable-line

export const ModalWrapper = styled.div`
  /* max-width: 700; */
  min-width: 400px;
  padding: 2rem 1.5rem;
  height: auto;
  position: relative;
  background-color: #fff;
  z-index: 1;
  overflow-y: auto;
  border-radius: 12px;
  margin: 0;
  outline: 0;
  box-sizing: border-box;
  font-family: "Halyard Display";
  border: none;
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
`;

export const Proposal = styled.div`
  font-size: 1.5rem;
  font-weight: 500;
  color: #000;
  margin-bottom: 2rem;
`;

export const Description = styled.p`
  line-height: 1.71rem;
  color: grey;
  max-width: 500px;
  margin-bottom: 1.25rem;
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
