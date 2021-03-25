import { forwardRef } from "react";
import tw, { styled } from "twin.macro";
import { Times } from "assets/icons";

import Portal from "./Portal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const _Modal: React.ForwardRefRenderFunction<
  HTMLElement,
  React.PropsWithChildren<Props>
> = ({ children, isOpen, onClose }, externalRef) => {
  if (!isOpen) {
    return null;
  }
  return (
    <Portal>
      <Wrapper ref={externalRef}>
        <ExitButton onClick={onClose}>
          <Times />
        </ExitButton>
        <Content>{children}</Content>
      </Wrapper>
      <BgBlur />
    </Portal>
  );
};

const Modal = forwardRef(_Modal);
Modal.displayName = "Modal";

export const Wrapper = styled.aside`
  ${tw`z-20 bg-white rounded border border-opacity-10 absolute inset-x-0 mx-auto p-5 max-w-max flex flex-col items-center`};
  top: 150px;
`;

const Content = tw.div`pb-7 px-5`;

const BgBlur = tw.div`
  absolute z-10 inset-0 bg-black bg-opacity-50
`;
const ExitButton = tw.button`w-4 h-4 text-gray self-end`;

export default Modal;
