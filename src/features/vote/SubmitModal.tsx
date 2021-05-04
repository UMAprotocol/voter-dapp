import { ForwardRefRenderFunction, PropsWithChildren, forwardRef } from "react";

import Modal from "common/components/modal";
interface Props {
  isOpen: boolean;
  close: () => void;
  ref: (node: HTMLElement | null) => void;
}
const _SubmitModal: ForwardRefRenderFunction<
  HTMLElement,
  PropsWithChildren<Props>
> = ({ isOpen, close }, externalRef) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={() => close()} ref={externalRef}>
        <p>Modal</p>
      </Modal>
    </>
  );
};

const SubmitModal = forwardRef(_SubmitModal);
SubmitModal.displayName = "SubmitModal";

export default SubmitModal;
