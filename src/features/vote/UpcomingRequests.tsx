/** @jsxImportSource @emotion/react */
import { FC } from "react";
import tw, { styled } from "twin.macro"; // eslint-disable-line
import { PriceRequestAdded } from "web3/queryVotingContractEvents";
import RequestsWrapper from "./RequestsWrapper";

interface Props {
  upcomingRequests: PriceRequestAdded[];
}
const UpcomingRequests: FC<Props> = ({ upcomingRequests }) => {
  return (
    <StyledUpcomingRequests className="UpcomingRequests">
      <div className="requests-header-row">
        <div>
          <p className="requests-title-lg title">Upcoming Requests</p>
        </div>
      </div>
    </StyledUpcomingRequests>
  );
};

const StyledUpcomingRequests = styled(RequestsWrapper)`
  &.UpcomingRequests {
  }
`;

export default UpcomingRequests;
