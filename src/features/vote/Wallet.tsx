/** @jsxImportSource @emotion/react */
import { FC, useState, useEffect } from "react";
import tw, { styled } from "twin.macro"; // eslint-disable-line
import Modal from "common/components/modal";
import useModal from "common/hooks/useModal";
import Button from "common/components/button";
import useConnection from "common/hooks/useConnection";
import { Settings } from "assets/icons";
import getUmaBalance from "common/utils/getUmaBalance";

interface Props {
  // connect: Connect;
  // disconnect: Disconnect;
}

const DEFAULT_BALANCE = ["0.000", "0000"];

const Wallet: FC<Props> = () => {
  const [umaBalance, setUmaBalance] = useState(DEFAULT_BALANCE);
  const [totalUmaCollected] = useState(DEFAULT_BALANCE);
  const [availableRewards] = useState(DEFAULT_BALANCE);

  const { isOpen, open, close, modalRef } = useModal();
  const {
    initOnboard,
    setInitOnboard,
    isConnected,
    onboard,
    disconnect,
    signer,
  } = useConnection();

  useEffect(() => {
    if (signer && onboard) {
      getUmaBalance(onboard.getState().address, signer).then((balance) => {
        setUmaBalance(formatWalletBalance(balance));
      });
    }
  }, [signer, onboard]);

  return (
    <StyledWallet>
      <div tw="flex items-stretch items-center">
        <div tw="py-8 pl-5 flex-grow">
          <p className="wallet-title">Voting Wallet</p>
          {isConnected ? (
            <Connected>
              Connected with {onboard?.getState().wallet.name}
            </Connected>
          ) : (
            <Disconnected>Not Connected</Disconnected>
          )}

          {!isConnected ? (
            <Button
              className="connect-btn"
              onClick={() => {
                if (!initOnboard) setInitOnboard(true);
              }}
              variant="primary"
            >
              Connect Wallet
            </Button>
          ) : (
            <Button
              className="connect-btn"
              onClick={() => {
                disconnect();
              }}
              variant="primary"
            >
              Disconnect
            </Button>
          )}
        </div>

        <div tw="my-5 mx-3 flex-grow border-r">
          <p className="sm-title">UMA Balance</p>
          <div className="value-tokens">
            <span>{umaBalance[0]}</span>
            <span>{umaBalance[1]}</span>
          </div>
          <p className="value-dollars">$00.00 USD</p>
        </div>
        <div tw="my-5 mx-3 pl-5 flex-grow border-r">
          <p className="sm-title">Total UMA Collected</p>
          <div className="value-tokens">
            <span>{totalUmaCollected[0]}</span>
            <span>{totalUmaCollected[1]}</span>
          </div>
          <p className="value-dollars">$00.00 USD</p>
        </div>
        <div tw="my-5 mx-3 pl-5 flex-grow">
          <p className="sm-title">Available Rewards</p>
          <div className="value-tokens">
            <span>{availableRewards[0]}</span>
            <span>{availableRewards[1]}</span>
          </div>
          <p className="value-dollars">$00.00 USD</p>
        </div>
        <div tw="py-10 pl-5 ml-auto flex-none">
          <Settings onClick={() => open()} tw="cursor-pointer" />
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={close} ref={modalRef}>
        <StyledModal>
          <h3 className="header">Two Key Voting</h3>
          <p tw="opacity-50 mb-4 text-center">
            You are not currently using a two key voting system. To deploy one,
            provide your cold key address. Click here to learn more about the
            two key voting system.
          </p>
          <div tw="flex items-stretch">
            <Disconnected tw="flex-grow">Not Connected</Disconnected>
            <div className="open-form" tw="flex-grow text-right">
              Add Cold Wallet Address
            </div>
          </div>
        </StyledModal>
      </Modal>
    </StyledWallet>
  );
};

const StyledWallet = styled.div`
  background-color: #fff;

  ${tw`max-w-7xl mx-auto py-5 px-8 my-10`};
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
`;

const StyledModal = styled.div`
  max-width: 375px;
  padding: 2rem 1.5rem;
  height: auto;
  position: relative;
  background-color: #fff;
  z-index: 1;
  overflow-y: auto;
  border-radius: 12px;
  margin: 0;
  outline: 0;
  box-sizing: border-box;
  font-family: "Halyard Display";
  border: none;
  .header {
    text-align: center;
    margin-bottom: 1rem;
    font-weight: 600;
    font-size: 1.25rem;
  }
  .header-body {
    border-color: #e5e5e5;
    padding-bottom: 4rem;
  }
  .open-form {
    color: #ff4a4a;
    font-size: 0.8rem;
    line-height: 2rem;
    text-decoration: underline;
  }
`;

const Connected = styled.div`
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

const Disconnected = styled(Connected)`
  &::before {
    background-color: #000;
    opacity: 0.5;
  }
`;

// There are two different colours for the first 4 digits and last 4 digits of the number.
// Hence we need to return an array of strings.
function formatWalletBalance(balance: string): string[] {
  if (balance.includes(".")) {
    const strArray: string[] = [];
    const split = balance.split(".");
    const rightSide = split[1].substr(0, 8);

    strArray.push(`${split[0]}.${rightSide.substr(0, 3)}`);
    strArray.push(rightSide.substr(4, 8));
    return strArray;
  } else {
    return [`${balance}.000`, "0000"];
  }
}

export default Wallet;
