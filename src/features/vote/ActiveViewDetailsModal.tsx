import {
  ForwardRefRenderFunction,
  PropsWithChildren,
  forwardRef,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import Modal from "common/components/modal";
import {
  ModalWrapper,
  MiniHeader,
  Proposal,
  Description,
  DiscordWrapper,
  StateValue,
} from "./styled/PastViewDetailsModal.styled";
import { ModalState } from "./ActiveRequests";
import { DiscordRed } from "assets/icons";
import { ethers } from "ethers";

interface Props {
  isOpen: boolean;
  close: () => void;
  ref: (node: HTMLElement | null) => void;
  proposal: string;
  setModalState: Dispatch<SetStateAction<ModalState>>;
  totalSupply: string;
  correct: string;
  numberCommitVoters: number;
  numberRevealVoters: number;
  timestamp: string;
  rewardsClaimed: string;
}

const _ActiveViewDetailsModal: ForwardRefRenderFunction<
  HTMLElement,
  PropsWithChildren<Props>
> = (
  { isOpen, close, proposal, setModalState, timestamp, rewardsClaimed },
  externalRef
) => {
  const [formattedRewardsClaimed, setFormattedRewardsClaimed] = useState("0");

  // Format rewards to 6 decs. It is a Big Num as it the value is in wei.
  useEffect(() => {
    const formatRCArr = ethers.utils.formatEther(rewardsClaimed).split(".");
    formatRCArr[1] = formatRCArr[1].substring(0, 6);
    const formatRC = formatRCArr.join(".");
    setFormattedRewardsClaimed(formatRC);
  }, [rewardsClaimed]);

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
