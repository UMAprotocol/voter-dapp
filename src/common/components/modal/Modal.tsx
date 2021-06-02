import { forwardRef, PropsWithChildren, ForwardRefRenderFunction } from "react";
import tw, { styled } from "twin.macro";
import { Times } from "assets/icons";

import Portal from "./Portal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const _Modal: ForwardRefRenderFunction<HTMLElement, PropsWithChildren<Props>> =
  ({ children, isOpen, onClose }, externalRef) => {
    if (!isOpen) {
      return null;
    }
    return (
      <Portal>
        <Wrapper ref={externalRef} coords={{ y: window.scrollY }}>
          <ExitButton onClick={onClose}>
            <Times />
          </ExitButton>
          <Content>{children}</Content>
        </Wrapper>
        <BgBlur coords={{ y: window.scrollY }} />
      </Portal>
    );
  };

const Modal = forwardRef(_Modal);
Modal.displayName = "Modal";

interface StyledProps {
  coords?: {
    y?: number;
    x?: number;
  };
}

const DEFAULT_TOP_VALUE = 150;

export const Wrapper = styled.aside<StyledProps>`
  ${tw`z-20 bg-white rounded border-0 border-opacity-10 absolute inset-x-0 mx-auto p-5 max-w-max flex flex-col items-center`};
  top: ${(props) => {
    return props.coords && props.coords.y
      ? `${props.coords.y + DEFAULT_TOP_VALUE}px`
      : `${DEFAULT_TOP_VALUE}px`;
  }};
  overflow-y: scroll;
  max-height: 80vh;
`;

const Content = tw.div`pb-7 px-5`;

const BgBlur = styled.div<StyledProps>`
  ${tw`absolute z-10 bg-black bg-opacity-50`};

  height: 100%;
  top: ${(props) => {
    return props.coords && props.coords.y ? `${props.coords.y}px` : `0px`;
  }};
  right: 0px;
  bottom: 0px;
  left: 0px;
`;
const ExitButton = styled.button`
  ${tw`w-4 h-4 text-gray self-end`};
  &:focus {
    outline: none;
  }
`;

export default Modal;
