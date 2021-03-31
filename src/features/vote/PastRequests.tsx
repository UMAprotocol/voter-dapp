/** @jsxImportSource @emotion/react */
import { FC } from "react";
import tw, { styled } from "twin.macro"; // eslint-disable-line
import { PriceRound } from "./useVotingEvents";

interface Props {
  pastRequests: PriceRound[];
}

const PastRequests: FC<Props> = () => {
  return (
    <StyledPastRequests>
      <div className="header-row" tw="flex items-stretch p-10">
        <div tw="flex-grow">
          <p className="big-title">Past Requests</p>
        </div>
      </div>
    </StyledPastRequests>
  );
};

const StyledPastRequests = styled.div`
  font-family: "Halyard Display";
  ${tw`max-w-full p-12`};
  background-color: #fff;
  .header-row {
    max-width: 1350px;
    margin: 0 auto;
    /* .title {
      font-size: 1.75rem;
      font-weight: 600;
      margin-bottom: 9px;
      letter-spacing: -0.02em;
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
    } */
  }
`;

export default PastRequests;
