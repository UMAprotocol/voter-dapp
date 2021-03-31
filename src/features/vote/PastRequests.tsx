/** @jsxImportSource @emotion/react */
import { FC } from "react";
import tw, { styled } from "twin.macro"; // eslint-disable-line
import { PriceRound } from "./useVotingEvents";
import Button from "common/components/button";

interface Props {
  pastRequests: PriceRound[];
}

const PastRequests: FC<Props> = ({ pastRequests }) => {
  return (
    <StyledPastRequests>
      <div className="header-row" tw="flex items-stretch p-10">
        <div tw="flex-grow">
          <p className="big-title">Past Requests</p>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Proposal</th>
            <th>Correct Vote</th>
            <th>Your Vote</th>
            <th>Earned Rewards</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {pastRequests.map((el, index) => {
            return (
              <tr key={index}>
                <td>
                  <div className="identifier">{el.identifier}</div>
                </td>
                <td>
                  <div>Yes</div>
                </td>
                <td>
                  <div>Yes</div>
                </td>
                <td>
                  <div>0.1000</div>
                </td>
                <td>
                  <div>{Date.now()}</div>
                </td>
                <td>
                  <div>
                    <Button variant="primary">Collect Reward</Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </StyledPastRequests>
  );
};

const StyledPastRequests = styled.div`
  font-family: "Halyard Display";
  background-color: #fff;
  ${tw`max-w-7xl mx-auto py-5 my-10 mb-10`};

  .header-row {
    max-width: 1350px;
    margin: 0 auto;
    padding-bottom: 2rem;
    .big-title {
      font-size: 2.5rem;
      font-weight: 600;
      line-height: 1.38;
    }
  }
  .table {
    ${tw`table-auto`};
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
      td:first-of-type {
        /* div {

      }
      max-width: 150px; */
      }

      td:last-child {
        svg {
          margin: 0 auto;
        }
      }
    }
  }
`;

export default PastRequests;
