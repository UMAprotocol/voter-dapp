/** @jsxImportSource @emotion/react */
import tw, { styled } from "twin.macro"; // eslint-disable-line
import RequestsWrapper from "./RequestsWrapper";

const UpcomingRequests = () => {
  return (
    <StyledUpcomingRequests className="UpcomingRequests">
      <h2>Upcoming Requests</h2>
    </StyledUpcomingRequests>
  );
};

const StyledUpcomingRequests = styled(RequestsWrapper)`
  &.UpcomingRequests {
  }
`;

export default UpcomingRequests;
