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
`;

export const Proposal = styled.div`
  font-size: 1.5rem;
  font-weight: 500;
  color: #000;
`;
