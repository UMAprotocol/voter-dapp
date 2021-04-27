import {
  ForwardRefRenderFunction,
  PropsWithChildren,
  forwardRef,
  Dispatch,
  SetStateAction,
} from "react";
import Modal from "common/components/modal";
import {
  ModalWrapper,
  MiniHeader,
  Proposal,
} from "./styled/ViewDetailsModal.styled";
import { ModalState } from "./PastRequests";

interface Props {
  isOpen: boolean;
  close: () => void;
  ref: (node: HTMLElement | null) => void;
  proposal: string;
  setModalState: Dispatch<SetStateAction<ModalState>>;
}

const _ViewDetailsModal: ForwardRefRenderFunction<
  HTMLElement,
  PropsWithChildren<Props>
> = ({ isOpen, close, proposal, setModalState }, externalRef) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          close();
          setModalState({ proposal: "" });
        }}
        ref={externalRef}
      >
        <ModalWrapper>
          <MiniHeader>Proposal</MiniHeader>
          <Proposal>{proposal}</Proposal>
        </ModalWrapper>
      </Modal>
    </>
  );
};

const ViewDetailsModal = forwardRef(_ViewDetailsModal);
ViewDetailsModal.displayName = "ViewDetailsModal";

export default ViewDetailsModal;
