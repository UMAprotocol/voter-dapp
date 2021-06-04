/** @jsxImportSource @emotion/react */
import tw, { styled } from "twin.macro"; // eslint-disable-line

interface StyledFormProps {
  isConnected: boolean;
  publicKey: string;
}

export const FormWrapper = styled.form<StyledFormProps>`
  &.CommitPhase {
    padding: 1rem 4rem;
    .identifier {
      align-items: flex-start;
      flex-direction: column;
      p:first-of-type {
        margin-bottom: 0.5rem;
      }
      .view-details {
        color: #ff4a4a;
        text-decoration: underline;
        font-weight: 600;
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
    .table {
      ${tw`table-auto`};
      width: 100%;
      max-width: 1250px;
      margin: 0 auto;
      border-collapse: separate;
      border-spacing: 0 15px;
      .input-cell {
        cursor: ${(props) =>
          props.isConnected && props.publicKey ? "auto" : "not-allowed"};
        input,
        .select {
          div {
            margin: 1rem 0;
          }
          ul {
            background-color: #fff;
          }
          // Double check the user is connected and has signed the message so their public / private signing keys are defined.
          pointer-events: ${(props) =>
            props.isConnected && props.publicKey ? "all" : "none"};
          opacity: ${(props) =>
            props.isConnected && props.publicKey ? "1" : "0.5"};
          label {
            display: block;
          }
        }
      }
      thead {
        tr {
          text-align: left;
          margin-bottom: 2rem;
        }
        th:last-child {
          text-align: center;
        }
        th {
          padding-bottom: 1rem;
          padding-left: 15px;
          padding-right: 15px;
          border-bottom: 1px solid #e5e5e5;
        }
      }

      tbody {
        td {
          vertical-align: baseline;
          border-color: #fff;
          border-style: solid;
          border-width: 0 15px;
          vertical-align: baseline;
          div {
            display: flex;
          }
          .description {
            max-width: 500px;
          }
          /* padding-bottom: 0.5rem; */
        }

        td:last-child {
          svg {
            margin: 0 auto;
          }
        }
      }
      .vote {
        margin: 0 auto;
      }
      .empty-vote {
        text-align: center;
      }
    }
    .end-row {
      margin-top: 1rem;
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
