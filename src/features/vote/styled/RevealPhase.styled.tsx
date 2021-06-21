/** @jsxImportSource @emotion/react */
import tw, { styled } from "twin.macro"; // eslint-disable-line

interface StyledProps {
  isConnected: boolean;
}
export const Wrapper = styled.div<StyledProps>`
  &.RequestPhase {
    padding: 1rem 4rem;

    .identifier {
      align-items: flex-start;
      flex-direction: column;
      p:first-of-type {
        margin-bottom: 0.5rem;
        font-size: 28px;
        font-weight: 500;
      }
      .view-details {
        color: #ff4a4a;
        text-decoration: underline;
        font-weight: 500;
        font-size: 14px;
        &:hover {
          cursor: pointer;
        }
      }
    }
    .status {
      p {
        margin: 0 auto;
      }
    }
    .center-header {
      text-align: center;
    }
    .end-row {
      margin-top: 3rem;
      max-width: 1400px;
      margin-top: 1rem;
      margin-left: auto;
      margin-right: auto;
      display: flex;
      justify-content: flex-end;
      .end-row-item {
      }
    }
  }
`;
