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
  Description,
  DiscordWrapper,
} from "./styled/ViewDetailsModal.styled";
import { ModalState } from "./PastRequests";
import { DiscordRed } from "assets/icons";

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
          <MiniHeader>Description</MiniHeader>
          <Description>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu
            fringilla nunc. Sed mi arcu, consequat sed magna sed, auctor blandit
            velit. Aliquam tincidunt, tortor vestibulum tempor tincidunt, lorem
            velit dapibus purus, in lacinia velit lectus eget libero. Phasellus
            sit amet lacinia ipsum, sed sollicitudin sapien. Integer et lacinia
            nulla. Suspendisse ultrices, nisl vel egestas aliquam, nisi mi
            imperdiet quam, ut faucibus diam ante ut elit. Vivamus venenatis a
            purus nec vehicula. Cras mollis vel ligula nec vulputate. Integer
            vehicula molestie sapien, eu dapibus metus auctor in. Nullam viverra
            urna odio, sit amet lobortis metus interdum id. Nulla enim justo,
            eleifend in metus in, eleifend dapibus ante. Donec nec egestas
            lacus.
          </Description>
          <DiscordWrapper>
            <span>
              <a
                target="_blank"
                href="https://discord.umaproject.org"
                rel="noreferrer"
              >
                <div>
                  <DiscordRed />
                </div>
                Join the UMA Discord
              </a>
            </span>
          </DiscordWrapper>
        </ModalWrapper>
      </Modal>
    </>
  );
};

const ViewDetailsModal = forwardRef(_ViewDetailsModal);
ViewDetailsModal.displayName = "ViewDetailsModal";

export default ViewDetailsModal;
