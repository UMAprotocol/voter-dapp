/** @jsxImportSource @emotion/react */
import tw, { styled } from "twin.macro"; // eslint-disable-line

interface StyledFormProps {
  isConnected: boolean;
  publicKey: string;
}

export const FormWrapper = styled.form<StyledFormProps>`
  &.CommitPhase {
    padding: 1rem 4rem;
    background-color: #fff;
    width: 100%;
    overflow-y: auto;

    .identifier {
      align-items: flex-start;
      flex-direction: column;
      p:first-of-type {
        margin-bottom: 0.5rem;
        font-size: 28px;
        font-weight: 500;
      }
      .view-details {
        color: #ff4a4a;
        text-decoration: underline;
        font-weight: 500;
        font-size: 14px;
        &:hover {
          cursor: pointer;
        }
      }
    }
    .status {
      p {
        margin: 0 auto;
      }
    }
    .center-header {
      text-align: center;
    }
    .end-row {
      margin-top: 3rem;
      max-width: 1400px;
      margin-top: 1rem;
      margin-left: auto;
      margin-right: auto;
      display: flex;
      justify-content: flex-end;
      .end-row-item {
        text-align: right;
      }
    }
  }
`;

export const CommitInputLabel = styled.label`
  width: 100%;
  padding-left: 4px;
  margin-bottom: 11px;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.71;
  display: block;
  color: #000;
  font-family: "Halyard Display";
`;

export const NoPublicKeyErrorWrapper = styled.div`
  color: #ff4a4a;
  background-color: #fff4f6;
  border: 1px solid #ffd6d9;
  border-radius: 8px;
  max-width: 400px;
  text-align: left;
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
`;
