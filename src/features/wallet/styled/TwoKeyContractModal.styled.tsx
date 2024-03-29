/** @jsxImportSource @emotion/react */
import tw, { styled } from "twin.macro"; // eslint-disable-line

export const ModalWrapper = styled.div`
  max-width: 400px;
  padding: 2rem 1.5rem;
  overflow-y: auto;
  height: auto;
  position: relative;
  background-color: #fff;
  z-index: 1;
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
  .open-form {
    color: #ff4a4a;
    font-size: 0.8rem;
    line-height: 2rem;
    text-decoration: underline;
    &:hover {
      cursor: pointer;
    }
  }
  label {
    color: #000;
    opacity: 0.5;
    margin-bottom: 4px;
  }
  input {
    width: 350px;
    margin-bottom: 1rem;
  }
`;

export const FormWrapper = styled.div`
  margin-top: 1rem;
`;

export const ButtonWrapper = styled.div`
  text-align: center;
  button {
    &:first-of-type {
      margin-right: 1rem;
    }
    &:nth-of-type(2) {
      margin-left: 1rem;
    }
    width: 157px;
  }
`;

export const Error = styled.span`
  color: #ff4a4a;
  margin: 1rem 0;
  font-size: 0.75rem;
`;

export const Anchor = styled.a`
  color: #ff4a4a;
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

export const FormSuccess = styled.div`
  margin-top: 1rem;
  text-align: center;
`;
