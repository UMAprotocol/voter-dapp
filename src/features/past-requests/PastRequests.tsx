/** @jsxImportSource @emotion/react */
import { FC, useState, useEffect } from "react";
import tw, { styled } from "twin.macro"; // eslint-disable-line
import { PriceRound } from "../vote/useVotingEvents";
import Button from "common/components/button";

interface Props {
  pastRequests: PriceRound[];
}

const PastRequests: FC<Props> = ({ pastRequests }) => {
  const [filteredPastRequests, setFilteredPastRequests] = useState<
    PriceRound[]
  >([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (pastRequests.length) {
      if (!showAll) {
        const filteredRequests = pastRequests.slice(0, 5);
        setFilteredPastRequests(filteredRequests);
      } else {
        setFilteredPastRequests(pastRequests);
      }
    }
  }, [pastRequests, showAll]);
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
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredPastRequests.map((el, index) => {
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
      {pastRequests.length ? (
        <div className="bottom-row">
          <Button variant="primary" onClick={() => setShowAll(true)}>
            View All
          </Button>
        </div>
      ) : null}
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
        &:last-child div {
          padding-bottom: 2rem;
        }
        div {
          display: flex;
          align-items: center;
          border-bottom: 1px solid #e5e5e5;
          padding: 0.5rem;
          padding-bottom: 3rem;
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
  .bottom-row {
    text-align: center;
    button {
      width: 150px;
    }
  }
`;

export default PastRequests;
