import { ForwardRefRenderFunction, PropsWithChildren, forwardRef } from "react";
import Modal from "common/components/modal";
import { ModalWrapper, MiniHeader } from "./styled/ViewDetailsModal.styled";
interface Props {
  isOpen: boolean;
  close: () => void;
  ref: (node: HTMLElement | null) => void;
}

const _ViewDetailsModal: ForwardRefRenderFunction<
  HTMLElement,
  PropsWithChildren<Props>
> = ({ isOpen, close }, externalRef) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={close} ref={externalRef}>
        <ModalWrapper>
          <MiniHeader>Proposal</MiniHeader>
        </ModalWrapper>
      </Modal>
    </>
  );
};

const ViewDetailsModal = forwardRef(_ViewDetailsModal);

export default ViewDetailsModal;
