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
  LastStateValue,
} from "./styled/DetailModals.styled";
import { ModalState } from "./PastRequests";
import { DiscordRed, CopyIcon } from "assets/icons";
import { ethers } from "ethers";
import useUMIP from "./hooks/useUMIP";
import useOnboard from "common/hooks/useOnboard";
import toWeiSafe from "common/utils/web3/convertToWeiSafely";
import ReactTooltip from "react-tooltip";
import { determineTitleAndDescription } from "common/helpers/proposalTitleAndDescription/determineTitleAndDescription";
interface Props {
  isOpen: boolean;
  close: () => void;
  ref: (node: HTMLElement | null) => void;
  proposal: string;
  ancillaryData: string;
  setModalState: Dispatch<SetStateAction<ModalState>>;
  totalSupply: string;
  correct: string;
  numberCommitVoters: number;
  numberRevealVoters: number;
  timestamp: string;
  rewardsClaimed: string;
  unix: string;
}

const _PastViewDetailsModal: ForwardRefRenderFunction<
  HTMLElement,
  PropsWithChildren<Props>
> = (
  {
    isOpen,
    close,
    proposal,
    ancillaryData,
    setModalState,
    totalSupply,
    correct,
    numberCommitVoters,
    numberRevealVoters,
    timestamp,
    rewardsClaimed,
    unix,
  },
  externalRef
) => {
  const [formattedRewardsClaimed, setFormattedRewardsClaimed] = useState("0");
  // Note: because there is dynamic content, this will rebuild the tooltip for addressing the conditional
  // elements on the page. See ReactTooltip docs.
  useEffect(() => {
    ReactTooltip.rebuild();
  });

  // Format rewards to 6 decs. It is a Big Num as it the value is in wei.
  useEffect(() => {
    if (rewardsClaimed !== "-" && rewardsClaimed !== "0") {
      const rcToWei = toWeiSafe(rewardsClaimed);
      const formatRCArr = ethers.utils.formatEther(rcToWei).split(".");
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
  const { title, description } = determineTitleAndDescription(
    ancillaryData,
    proposal,
    isUmip,
    umip
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          close();
          setModalState({
            proposal: "",
            ancillaryData: "",
            correct: "",
            totalSupply: "",
            numberCommitVoters: 0,
            numberRevealVoters: 0,
            timestamp: "",
            rewardsClaimed: "0",
            unix: "",
          });
        }}
        ref={externalRef}
      >
        <ModalWrapper>
          <MiniHeader>Proposal</MiniHeader>
          <Proposal>{title}</Proposal>

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
            {umip?.umipLink && (
              <IconsItem>
                <a target="_blank" href={umip?.umipLink} rel="noreferrer">
                  <Icon>
                    <CopyIcon />
                  </Icon>
                  Link to UMIP
                </a>
              </IconsItem>
            )}
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
          <LastStateValue
            data-for="past-modal-timestamp"
            data-tip={`UTC: ${unix}`}
          >
            {timestamp}
          </LastStateValue>
        </ModalWrapper>
        <ReactTooltip
          id="past-modal-timestamp"
          place="top"
          type="dark"
          effect="float"
        />
      </Modal>
    </>
  );
};

const PastViewDetailsModal = forwardRef(_PastViewDetailsModal);
PastViewDetailsModal.displayName = "PastViewDetailsModal";

export default PastViewDetailsModal;
