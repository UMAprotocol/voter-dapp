/** @jsxImportSource @emotion/react */
import { FC, useEffect, useState } from "react";
import tw, { styled } from "twin.macro"; // eslint-disable-line
import { PriceRequestAdded } from "web3/queryVotingContractEvents";
import RequestsWrapper from "./RequestsWrapper";
import { DateTime } from "luxon";

interface FormattedRequest {
  proposal: string;
  description: string;
  timestamp: string;
}

interface Props {
  upcomingRequests: PriceRequestAdded[];
}
const UpcomingRequests: FC<Props> = ({ upcomingRequests }) => {
  const [formattedRequests, setFormattedRequests] = useState<
    FormattedRequest[]
  >([]);

  useEffect(() => {
    if (upcomingRequests.length) {
      const values = upcomingRequests.map((el) => {
        const datum = {} as FormattedRequest;
        datum.proposal = el.identifier;
        datum.description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        `;
        datum.timestamp = DateTime.fromSeconds(Number(el.time)).toLocaleString({
          month: "short",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h24",
          timeZoneName: "short",
        });

        return datum;
      });
      console.log("values", values);
      setFormattedRequests(values);
    }
  }, [upcomingRequests]);

  return (
    <StyledUpcomingRequests className="UpcomingRequests">
      <div className="requests-header-row">
        <div>
          <p className="requests-title-lg title">Upcoming Requests</p>
        </div>
      </div>
      <table className="requests-table">
        <thead>
          <tr>
            <th>Proposal</th>
            <th>Description</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {formattedRequests.map((el, index) => {
            return (
              <tr key={index}>
                <td>
                  <div className="identifier">{el.proposal}</div>
                </td>
                <td>
                  <div className="requests-description">
                    <p>{el.description}</p>
                  </div>
                </td>
                <td>
                  <div>{el.timestamp}</div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </StyledUpcomingRequests>
  );
};

const StyledUpcomingRequests = styled(RequestsWrapper)`
  &.UpcomingRequests {
  }
`;

export default UpcomingRequests;
