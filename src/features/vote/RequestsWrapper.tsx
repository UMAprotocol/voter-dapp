/** @jsxImportSource @emotion/react */
import tw, { styled } from "twin.macro"; // eslint-disable-line

// Past and Upcoming have the same wrapper styles.
const RequestsWrapper = styled.div`
  font-family: "Halyard Display";
  background-color: #fff;
  ${tw`max-w-7xl mx-auto py-5 my-10 mb-10`};
  .header-row {
    max-width: 1350px;
    margin: 0 auto;
    padding-bottom: 2rem;
    ${tw`flex items-stretch p-10`}
    > div {
      ${tw`flex-grow`}
    }
    .big-title {
      font-size: 2.5rem;
      font-weight: 600;
      line-height: 1.38;
      background-color: white;
    }
  }
  .table {
    ${tw`table-auto p-10`};
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
        border-bottom: 1px solid #e5e5e5;
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
          border-bottom: 1px solid #e5e5e5;
          padding: 0.5rem;
          padding-bottom: 3rem;
          min-height: 125px;
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
  }
  .bottom-row {
    text-align: center;
    button {
      width: 150px;
    }
  }
  .loading {
    padding: 2rem;
    font-size: 1.5rem;
    margin-left: 2rem;
    font-weight: 600;
  }
`;

export default RequestsWrapper;
