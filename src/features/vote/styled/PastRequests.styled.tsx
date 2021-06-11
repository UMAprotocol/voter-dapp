/** @jsxImportSource @emotion/react */
import tw, { styled } from "twin.macro"; // eslint-disable-line
import RequestsWrapper from "./RequestsWrapper.styled";

export const Wrapper = styled(RequestsWrapper)`
  &.PastRequests {
    margin-top: 0;
    .requests-header-row {
      max-width: 1350px;
      margin: 0 auto;
      padding-bottom: 2rem;
      display: flex;
      align-items: stretch;
      padding: 2.5rem;
      > div {
        flex-grow: 1;
      }
      .requests-title-lg {
        font-size: 2.5rem;
        font-weight: 600;
        line-height: 1.38;
        background-color: white;
      }
    }
    .requests-table {
      table-layout: auto;
      padding: 2.5rem;
      width: 100%;
      max-width: 1250px;
      margin: 0 auto;
      border-collapse: separate;
      border-spacing: 0 15px;

      thead {
        tr {
          text-align: left;
          margin-bottom: 2rem;
        }
        th {
          padding-bottom: 1rem;
          padding-right: 15px;
          border-bottom: 1px solid #e5e5e5;
          color: #818180;
          font-weight: 400;
        }
        th:last-child {
          /* text-align: center; */
        }
      }

      tbody {
        tr {
          height: 190px;
        }
        td {
          vertical-align: middle;
          border-bottom: 1px solid #e5e5e5;

          div {
            display: flex;
            align-items: flex-start;
            padding: 0.5rem;
          }
          .requests-description {
            // max-width: 500px;
            // width: 300px;
            word-wrap: break-word;
          }
        }

        td:last-child {
          svg {
            margin: 0 auto;
          }
        }
      }
    }

    .identifier {
      align-items: flex-start;
      flex-direction: column;
      p:first-of-type {
        margin-bottom: 0.5rem;
      }
      .PastRequests-view-details {
        color: #ff4a4a;
        text-decoration: underline;
        font-weight: 600;
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
`;
