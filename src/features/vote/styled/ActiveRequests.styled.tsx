/** @jsxImportSource @emotion/react */
import tw, { styled } from "twin.macro"; // eslint-disable-line

export const Wrapper = styled.div`
  &.ActiveRequests {
    font-family: "Halyard Display";
    ${tw`max-w-full p-12`};
    background-color: #fff;
    .header-row {
      max-width: 1350px;
      margin: 0 auto;

      .title {
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
      }
    }
  }
`;
