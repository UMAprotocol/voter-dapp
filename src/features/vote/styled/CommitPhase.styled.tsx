/** @jsxImportSource @emotion/react */
import tw, { styled } from "twin.macro"; // eslint-disable-line

interface StyledFormProps {
  isConnected: boolean;
}

export const FormWrapper = styled.form<StyledFormProps>`
<<<<<<< HEAD
  &.CommitPhase {
=======
  &.ActiveRequestsForm {
>>>>>>> de68851 (Fixed styling with submit modal and reveal phase.)
    .table {
      ${tw`table-auto`};
      width: 100%;
      max-width: 1250px;
      margin: 0 auto;
      border-collapse: separate;
      border-spacing: 0 15px;
      /* pointer-events: ${(props) => (props.isConnected ? "all" : "none")};
    cursor: ${(props) => (props.isConnected ? "auto" : "not-allowed")}; */
      .input-cell {
        cursor: ${(props) => (props.isConnected ? "auto" : "not-allowed")};
        input,
        select {
          pointer-events: ${(props) => (props.isConnected ? "all" : "none")};
          opacity: ${(props) => (props.isConnected ? "1" : "0.5")};
        }
      }
      select {
      }
      thead {
        tr {
          text-align: left;
          margin-bottom: 2rem;
        }
        th:last-child {
          text-align: center;
        }
      }

      tbody {
        td {
          div {
            display: flex;
            align-items: center;
          }
          .description {
            max-width: 500px;
          }
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
