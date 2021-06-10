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
      display: flex;
      justify-content: flex-end;
      .end-row-item {
      }
    }
  }
`;

export const CommitInputLabel = styled.label`
  width: 100%;
  padding-left: 4px;
  margin-bottom: 1rem;
  font-weight: 400;
  font-size: 16px;
`;
