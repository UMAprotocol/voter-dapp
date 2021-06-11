import tw, { styled } from "twin.macro"; // eslint-disable-line

export const Wrapper = styled.div`
  background-color: #f5f5f5;

  ${tw`max-w-full pt-5 mt-5 pb-1`};
  .wrapper {
    ${tw`max-w-7xl mx-auto py-5 px-8 my-10`}
    background-color: #fff;
  }

  .value-tokens {
    font-size: 1.5rem;
    margin: 0 0 11px;
    span {
      font-weight: 500;
    }
    span:last-child {
      font-weight: 500;
      color: #b3b2b2;
    }
  }
  .value-dollars {
    font-size: 0.8rem;
  }
`;

export const Connected = styled.div`
  font-size: 0.8rem;
  line-height: 2rem;
  flex-basis: 1;
  &::before {
    content: " ";
    display: inline-flex;
    width: 6px;
    height: 6px;
    background-color: #ff4a4a;
    border-radius: 50%;
    margin-right: 10px;
  }
`;

export const Disconnected = styled(Connected)`
  &::before {
    background-color: #000;
    opacity: 0.5;
  }
`;

export const Reconnect = styled(Connected)`
  &::before {
    background-color: #c99200;
    opacity: 0.5;
  }
`;

export const VotingAddress = styled.div`
  font-size: 0.8rem;
  line-height: 2rem;
  flex-basis: 1;
  color: #000;
  margin-left: 8px;
  cursor: pointer;
`;

export const WalletColumn = styled.div`
  ${tw`py-8 pl-5 flex-grow`};
  .wallet-title {
    font-weight: 600;
    font-size: 1.5rem;
  }
  .connect-btn {
    width: 150px;
  }
`;

export const UMABalance = styled.div`
  ${tw`my-5 mx-3 flex-grow border-r`};
  border-color: #e5e4e4;
`;

export const UMACollected = styled.div`
  ${tw`my-5 mx-3 pl-5 flex-grow border-r`};
  border-color: #e5e4e4;
`;

export const AvailableRewards = styled.div`
  ${tw`my-5 mx-3 pl-5 flex-grow`}
`;

export const SmallTitle = styled.p`
  margin: 0 0 12px;
  opacity: 0.5;
  font-size: 14px;
  font-weight: 400;
  color: #000;
  .Wallet-collect {
    text-decoration: underline;
    cursor: pointer;
    color: #ff4a4a;
    /* font-size: 0.875rem; */
    margin-left: 4px;
    margin-bottom: 1px;
    line-height: 1rem;
  }
`;

export const ValueTokens = styled.div`
  font-size: 1.5rem;
  margin: 0 0 11px;
  span {
    font-weight: 500;
  }
  span:last-child {
    font-weight: 500;
    color: #b3b2b2;
  }
`;

export const ValueDollars = styled.p`
  font-size: 0.8rem;
`;
