/** @jsxImportSource @emotion/react */
import { ForwardRefRenderFunction, PropsWithChildren, forwardRef } from "react";
import tw from "twin.macro"; // eslint-disable-line
import Modal from "common/components/modal";
import { ModalWrapper } from "./styled/TwoKeyContractModal.styled";
import { Disconnected } from "./styled/Wallet.styled";

interface Props {
  isOpen: boolean;
  close: () => void;
  ref: (node: HTMLElement | null) => void;
}
const _TwoKeyContractModal: ForwardRefRenderFunction<
  HTMLElement,
  PropsWithChildren<Props>
> = ({ isOpen, close }, externalRef) => {
  return (
    <Modal isOpen={isOpen} onClose={close} ref={externalRef}>
      <ModalWrapper>
        <h3 className="header">Two Key Voting</h3>
        <p tw="opacity-50 mb-4 text-center">
          You are not currently using a two key voting system. To deploy one,
          provide your cold key address. Click here to learn more about the two
          key voting system.
        </p>
        <div tw="flex items-stretch">
          <Disconnected tw="flex-grow">Not Connected</Disconnected>
          <div className="open-form" tw="flex-grow text-right">
            Add Cold Wallet Address
          </div>
        </div>
      </ModalWrapper>
    </Modal>
  );
};

const TwoKeyContractModal = forwardRef(_TwoKeyContractModal);
TwoKeyContractModal.displayName = "TwoKeyContractModal";

export default TwoKeyContractModal;
