/** @jsxImportSource @emotion/react */
import tw, { styled } from "twin.macro"; // eslint-disable-line

export const Wrapper = styled.div`
  &.ActiveRequests {
    font-family: "Halyard Display";
    background-color: #fff;
    ${tw`mx-auto py-5 my-10 mb-10`};
    .header-row {
      max-width: 1450px;
      margin: 0 auto;

      .title {
        font-size: 1.75rem;
        font-weight: 600;
        margin-bottom: 9px;
        span {
          color: #ff4a4a;
        }
      }

      .big-title,
      .time {
        font-size: 2.5rem;
        font-weight: 600;
      }
      .big-title {
        line-height: 1.38;
      }
      .time {
        color: #ff4a4a;
        letter-spacing: 0.04em;
        span {
          margin-left: 8px;
          display: inline-block;
          img {
            margin-top: -4px;
          }
        }
      }
    }
  }
`;

export const DescriptionWrapper = styled.div`
  max-width: 60ch;
`;
export const Description = styled.span`
  color: #818180;
  line-height: 1.57;
  font-size: ${14 / 16}rem;
  span {
    color: #ff4a4a;
    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }
`;

interface TableProps {
  isConnected?: boolean;
}

export const Table = styled.table<TableProps>`
  ${tw`table-auto`};
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  border-collapse: separate;
  border-spacing: 0 15px;
  .input-cell {
    cursor: ${(props) => (props.isConnected ? "auto" : "not-allowed")};
    input,
    select {
      pointer-events: ${(props) => (props.isConnected ? "all" : "none")};
      opacity: ${(props) => (props.isConnected ? "1" : "0.5")};
    }
  }
  thead {
    th {
      padding-bottom: 1rem;
      padding-right: 15px;
      border-bottom: 1px solid #e5e5e5;
      color: #000;
      font-weight: 400;
      font-size: 14px;
      line-height: 1.57;
      opacity: 0.5;
      @media screen and (max-width: 768px) {
        /* border-right: 0; */
        padding-left: 1rem;
        padding-right: 1rem;
      }
    }
    tr {
      text-align: left;
      margin-bottom: 2rem;
    }
  }

  tbody {
    tr {
      height: 190px;
    }
    td {
      border-color: #fff;
      border-style: solid;
      vertical-align: middle;
      border-bottom: 1px solid #e5e4e4;
      @media screen and (max-width: 768px) {
        /* border-right: 0; */
        padding-left: 1rem;
        padding-right: 1rem;
      }
      &:first-of-type {
        border-right: 12px solid transparent;
      }
      div {
        display: flex;
      }
      .description {
        max-width: 60ch;
      }
    }

    .last-cell {
    }
    td:last-child {
      text-align: center;
      svg {
        margin: 0 auto;
      }
    }
  }
  .vote {
    margin: 0 auto;
  }
`;

export const FullDate = styled.div`
  color: #818180;
`;
