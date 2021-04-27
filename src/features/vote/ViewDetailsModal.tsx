import { FC } from "react";
import Modal from "common/components/modal";
import { ModalWrapper, MiniHeader } from "./styled/ViewDetailsModal.styled";
interface Props {
  isOpen: boolean;
  close: () => void;
  ref: (node: HTMLElement | null) => void;
}

const ViewDetailsModal: FC<Props> = ({ isOpen, close, ref }) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={close} ref={ref}>
        <ModalWrapper>
          <MiniHeader>Proposal</MiniHeader>
        </ModalWrapper>
      </Modal>
    </>
  );
};

export default ViewDetailsModal;
