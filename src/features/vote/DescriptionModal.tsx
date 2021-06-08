import {
  ForwardRefRenderFunction,
  PropsWithChildren,
  forwardRef,
  Dispatch,
  SetStateAction,
  // useEffect,
  // useState,
} from "react";
import Modal from "common/components/modal";
import {
  ModalWrapper,
  Proposal,
  Description,
} from "./styled/DetailModals.styled";

interface Props {
  isOpen: boolean;
  close: () => void;
  ref: (node: HTMLElement | null) => void;
  description: string;
  setDescription: Dispatch<SetStateAction<string>>;
  proposal: string;
  setProposal: Dispatch<SetStateAction<string>>;
}

const _DescriptionModal: ForwardRefRenderFunction<
  HTMLElement,
  PropsWithChildren<Props>
> = (
  { isOpen, close, description, setDescription, proposal, setProposal },
  externalRef
) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          close();
          setDescription("");
          setProposal("");
        }}
        ref={externalRef}
      >
        <ModalWrapper>
          <Proposal>Description for Proposal: {proposal}</Proposal>
          <Description>{description}</Description>
        </ModalWrapper>
      </Modal>
    </>
  );
};

const DescriptionModal = forwardRef(_DescriptionModal);
DescriptionModal.displayName = "DescriptionModal";

export default DescriptionModal;
