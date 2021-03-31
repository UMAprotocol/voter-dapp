/** @jsxImportSource @emotion/react */
import { FC } from "react";
import tw, { styled } from "twin.macro"; // eslint-disable-line
import { PriceRound } from "./useVotingEvents";
import { UnlockedIcon } from "assets/icons";

interface Props {
  activeRequests: PriceRound[];
}

const ActiveRequestsForm: FC<Props> = ({ activeRequests }) => {
  return (
    <StyledActiveRequestsForm className="table">
      <thead>
        <tr>
          <th>Proposal</th>
          <th>Description</th>
          <th>Your Vote</th>
          <th>Vote Status</th>
        </tr>
      </thead>
      <tbody>
        {activeRequests.map((el, index) => {
          return (
            <tr key={index}>
              <td>
                <div className="identifier">{el.identifier}</div>
              </td>
              <td>
                <div className="description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Curabitur sed eleifend erat. Duis in ante nisi. Donec ut nibh
                  id justo faucibus fermentum id id ex. Mauris sollicitudin
                  consequat neque.
                </div>
              </td>
              <td>INPUT STUB</td>
              <td>
                <div>
                  <UnlockedIcon />
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </StyledActiveRequestsForm>
  );
};

const StyledActiveRequestsForm = styled.table`
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
    td:first-child {
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
`;

export default ActiveRequestsForm;