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
  IconsWrapper,
  StateValue,
  StateValueAncData,
  IconsItem,
  Icon,
} from "./styled/DetailModals.styled";
import { ModalState } from "./ActiveRequests";
import { DiscordRed, CopyIcon } from "assets/icons";

interface Props {
  isOpen: boolean;
  close: () => void;
  ref: (node: HTMLElement | null) => void;
  setModalState: Dispatch<SetStateAction<ModalState>>;
  proposal: string;
  timestamp: string;
  ancData: string;
}

const _ActiveViewDetailsModal: ForwardRefRenderFunction<
  HTMLElement,
  PropsWithChildren<Props>
> = (
  { isOpen, close, proposal, setModalState, timestamp, ancData },
  externalRef
) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          close();
          setModalState({
            proposal: "",
            timestamp: "",
            ancData: "0x",
          });
        }}
        ref={externalRef}
      >
        <ModalWrapper>
          <MiniHeader>Proposal</MiniHeader>
          <Proposal>{proposal}</Proposal>
          <MiniHeader>Ancillary Data (raw hexstring)</MiniHeader>
          <StateValueAncData>{ancData}</StateValueAncData>
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
          <IconsWrapper>
            <IconsItem>
              <a
                target="_blank"
                href="https://discord.umaproject.org"
                rel="noreferrer"
              >
                <Icon>
                  <DiscordRed />
                </Icon>
                Join the UMA Discord
              </a>
            </IconsItem>
            <IconsItem>
              <div
                onClick={() => navigator.clipboard.writeText(ancData)}
                className="copy-wrapper"
              >
                <Icon>
                  <CopyIcon />
                </Icon>
                Copy Link
              </div>
            </IconsItem>
          </IconsWrapper>

          <MiniHeader>Proposal Timestamp</MiniHeader>
          <StateValue>{timestamp}</StateValue>
        </ModalWrapper>
      </Modal>
    </>
  );
};

const ActiveViewDetailsModal = forwardRef(_ActiveViewDetailsModal);
ActiveViewDetailsModal.displayName = "ActiveViewDetailsModal";

export default ActiveViewDetailsModal;
