/** @jsxImportSource @emotion/react */
import tw, { styled } from "twin.macro"; // eslint-disable-line
import RequestsWrapper from "./RequestsWrapper.styled";

export const Wrapper = styled(RequestsWrapper)`
  &.PastRequests {
    .identifier {
      align-items: flex-start;
      flex-direction: column;
      p:first-child {
        margin-bottom: 0.5rem;
      }
      .PastRequests-view-details {
        color: #ff4a4a;
        text-decoration: underline;
        font-weight: 600;
      }
    }
  }
`;
