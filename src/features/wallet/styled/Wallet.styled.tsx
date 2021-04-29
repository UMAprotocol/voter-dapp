import tw, { styled } from "twin.macro"; // eslint-disable-line

export const Wrapper = styled.div`
  background-color: #f5f5f5;

  ${tw`max-w-full pt-5 mt-5 pb-1`};
  .wrapper {
    ${tw`max-w-7xl mx-auto py-5 px-8 my-10`}
    background-color: #fff;
  }
  .wallet-title {
    font-weight: 600;
    font-size: 1.5rem;
  }
  .sm-title {
    color: #000;
    margin: 0 0 12px;
    font-weight: 400;
    opacity: 0.5;
  }
  .value-tokens {
    font-size: 1.5rem;
    margin: 0 0 11px;
    span {
      font-weight: 500;
    }
    span:last-child {
      font-weight: 500;
      opacity: 0.3;
    }
  }
  .value-dollars {
    font-size: 0.8rem;
  }
  .connect-btn {
    /* margin-left: 12px; */
    width: 150px;
  }
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
