import {
  ForwardRefRenderFunction,
  PropsWithChildren,
  forwardRef,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import ReactMarkdown from "react-markdown";
import Modal from "common/components/modal";
import {
  ModalWrapper,
  MiniHeader,
  Proposal,
  Description,
  IconsWrapper,
  IconsItem,
  Icon,
  StateValue,
  StateValueAddress,
  RevealHeader,
  RevealPercentage,
} from "./styled/DetailModals.styled";
import { ModalState } from "./PastRequests";
import { DiscordRed } from "assets/icons";
import { ethers } from "ethers";
import useUMIP from "./useUMIP";
import useOnboard from "common/hooks/useOnboard";

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

const _PastViewDetailsModal: ForwardRefRenderFunction<
  HTMLElement,
  PropsWithChildren<Props>
> = (
  {
    isOpen,
    close,
    proposal,
    setModalState,
    totalSupply,
    correct,
    numberCommitVoters,
    numberRevealVoters,
    timestamp,
    rewardsClaimed,
  },
  externalRef
) => {
  console.log("rewards claimed", rewardsClaimed);
  const [formattedRewardsClaimed, setFormattedRewardsClaimed] = useState("0");

  // Format rewards to 6 decs. It is a Big Num as it the value is in wei.
  useEffect(() => {
    if (rewardsClaimed !== "-" && rewardsClaimed !== "0") {
      const formatRCArr = ethers.utils.formatEther(rewardsClaimed).split(".");
      formatRCArr[1] = formatRCArr[1].substring(0, 6);
      const formatRC = formatRCArr.join(".");
      setFormattedRewardsClaimed(formatRC);
    } else {
      setFormattedRewardsClaimed(rewardsClaimed);
    }
  }, [rewardsClaimed]);

  const { network } = useOnboard();

  const isUmip = proposal.includes("Admin");
  const umipNumber = isUmip ? parseInt(proposal.split(" ")[1]) : undefined;
  const { umip } = useUMIP(umipNumber, network?.chainId);

  const description =
    umip?.description ||
    `No description was found for this ${isUmip ? "umip" : "request"}.`;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          close();
          setModalState({
            proposal: "",
            correct: "",
            totalSupply: "",
            numberCommitVoters: 0,
            numberRevealVoters: 0,
            timestamp: "",
            rewardsClaimed: "0",
          });
        }}
        ref={externalRef}
      >
        <ModalWrapper>
          <MiniHeader>Proposal</MiniHeader>
          <Proposal>{isUmip ? umip?.title : proposal}</Proposal>

          <Description>
            <ReactMarkdown
              components={{
                h1: MiniHeader,
              }}
            >
              {description}
            </ReactMarkdown>
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
          </IconsWrapper>
          <MiniHeader>Correct Vote</MiniHeader>
          <StateValue>{correct}</StateValue>

          <MiniHeader>Total Supply</MiniHeader>
          <StateValue>{totalSupply}</StateValue>

          <MiniHeader>Rewards Claimed</MiniHeader>
          <StateValue>{formattedRewardsClaimed}</StateValue>

          <MiniHeader>Unique Commit Addresses</MiniHeader>
          <StateValueAddress>{numberCommitVoters}</StateValueAddress>

          <RevealHeader>
            {numberRevealVoters} Unique Reveal Addresses
          </RevealHeader>
          <RevealPercentage>
            {((numberRevealVoters / numberCommitVoters) * 100).toFixed(2)}% of
            Unique Commit Addresses
          </RevealPercentage>

          <MiniHeader>Proposal Timestamp</MiniHeader>
          <StateValue>{timestamp}</StateValue>
        </ModalWrapper>
      </Modal>
    </>
  );
};

const PastViewDetailsModal = forwardRef(_PastViewDetailsModal);
PastViewDetailsModal.displayName = "PastViewDetailsModal";

export default PastViewDetailsModal;
