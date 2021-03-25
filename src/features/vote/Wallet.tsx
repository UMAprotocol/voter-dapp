/** @jsxImportSource @emotion/react */
import { FC } from "react";
import tw, { styled } from "twin.macro"; // eslint-disable-line
import Modal from "common/components/modal";
import useModal from "common/hooks/useModal";

import { Settings } from "assets/icons";

const Wallet: FC = () => {
  const { isOpen, open, close, modalRef } = useModal();
  return (
    <Container>
      <div tw="flex items-stretch items-center">
        <div tw="py-8 pl-5 flex-grow">
          <p className="wallet-title">Voting Wallet</p>
          <p className="connected">Connected with MetaMask</p>
        </div>
        <div tw="my-5 mx-3 flex-grow border-r">
          <p className="sm-title">UMA Balance</p>
          <div className="value-tokens">
            <span>0.000</span>
            <span>0000</span>
          </div>
          <p className="value-dollars">$00.00 USD</p>
        </div>
        <div tw="my-5 mx-3 pl-5 flex-grow border-r">
          <p className="sm-title">Total UMA Collected</p>
          <div className="value-tokens">
            <span>0.000</span>
            <span>0000</span>
          </div>
          <p className="value-dollars">$00.00 USD</p>
        </div>
        <div tw="my-5 mx-3 pl-5 flex-grow">
          <p className="sm-title">Available Rewards</p>
          <div className="value-tokens">
            <span>0.000</span>
            <span>0000</span>
          </div>
          <p className="value-dollars">$00.00 USD</p>
        </div>
        <div tw="py-10 pl-5 ml-auto flex-none">
          <Settings onClick={() => open()} tw="cursor-pointer" />
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={close} ref={modalRef}>
        <div className="modal-wrapper">
          <h3>Voting Wallet</h3>
          <div tw="flex items-stretch">
            <div>Not Connected</div>
            <div>Add New Wallet</div>
          </div>
          <br />
          <h3>Two Key Voting</h3>
          <p>
            You are not currently using a two key voting system. To deploy one,
            provide your cold key address. Click here to learn more about the
            two key voting system.
          </p>
          <div tw="flex items-stretch">
            <div>Not Connected</div>
            <div>Add Cold Wallet Address</div>
          </div>
        </div>
      </Modal>
    </Container>
  );
};

const Container = styled.div`
  background-color: #fff;

  ${tw`max-w-7xl mx-auto py-5 px-8 my-10`};
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
`;

export default Wallet;
