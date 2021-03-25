/** @jsxImportSource @emotion/react */
import tw, { styled } from "twin.macro"; // eslint-disable-line

import settingsLogo from "assets/settings.svg";
import { FC } from "react";

const Container = styled.div`
  background-color: #fff;
  font-family: "Halyard Display";
  ${tw`max-w-7xl mx-auto p-8`};
  /* height: 100px */
  .wallet-title {
    font-weight: 600;
    font-size: 1.5rem;
  }
  .connected {
    font-size: 0.75rem;
    line-height: 2rem;
    &::before {
      content: " ";
      display: inline-flex;
      width: 6px;
      height: 6px;
      background-color: red;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
  .value-tokens {
    font-size: 1.25rem;
    span:first-child {
      font-weight: 600;
    }
    span:last-child {
      font-weight: 200;
    }
  }
`;
const Wallet: FC = () => {
  return (
    <Container>
      <div tw="flex items-stretch items-center">
        <div tw="py-8 pl-5 flex-grow">
          <p className="wallet-title">Voting Wallet</p>
          <p className="connected">Connected with MetaMask</p>
        </div>
        <div tw="py-5 px-3 flex-grow">
          <p className="sm-title">UMA Balance</p>
          <div className="value-tokens">
            <span>0.000</span>
            <span>0000</span>
          </div>
          <p className="value-dollars">$00.00 USD</p>
        </div>
        <div tw="py-5 px-3 flex-grow">
          <p className="sm-title">Total UMA Collected</p>
          <div className="value-tokens">
            <span>0.000</span>
            <span>0000</span>
          </div>
          <p className="value-dollars">$00.00 USD</p>
        </div>
        <div tw="py-5 px-3 flex-grow">
          <p className="sm-title">Available Rewards</p>
          <div className="value-tokens">
            <span>0.000</span>
            <span>0000</span>
          </div>
          <p className="value-dollars">$00.00 USD</p>
        </div>
        <div tw="py-10 pl-5 ml-auto flex-none">
          <img src={settingsLogo} alt="settings_icon" />
        </div>
      </div>
    </Container>
  );
};

export default Wallet;
