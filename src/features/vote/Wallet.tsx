/** @jsxImportSource @emotion/react */
import tw, { styled } from "twin.macro"; // eslint-disable-line

import settingsLogo from "assets/settings.svg";

const Container = styled.div`
  background-color: #fff;
  ${tw`max-w-7xl mx-auto p-8`};
  /* height: 100px */
`;
const Wallet = () => {
  return (
    <Container>
      <div tw="flex items-stretch">
        <div tw="py-8 pl-5 flex-grow">
          <p>Voting Wallet</p>
          <p>Connected with MetaMask</p>
        </div>
        <div tw="py-5 flex-grow">
          <p>UMA Balance</p>
          <p>0.000000</p>
          <p>$00.00 USD</p>
        </div>
        <div tw="py-5 flex-grow">
          <p>Total UMA Collected</p>
          <p>0.000000</p>
          <p>$00.00 USD</p>
        </div>
        <div tw="py-5 flex-grow">
          <p>Available Rewards</p>
          <p>0.000000</p>
          <p>$00.00 USD</p>
        </div>
        <div tw="py-10 pl-5 ml-auto flex-grow">
          <img src={settingsLogo} alt="settings_icon" />
        </div>
      </div>
    </Container>
  );
};

export default Wallet;
