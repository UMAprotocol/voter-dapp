import {
  ForwardRefRenderFunction,
  PropsWithChildren,
  forwardRef,
  Dispatch,
  SetStateAction,
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
  StateValue,
  StateValueAncData,
  IconsItem,
  Icon,
} from "./styled/DetailModals.styled";
import { ModalState } from "./ActiveRequests";
import { DiscordRed, CopyIcon } from "assets/icons";
import useUMIP from "./useUMIP";
import useOnboard from "common/hooks/useOnboard";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  const [copySuccess, setCopySuccess] = useState(false);

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
            timestamp: "",
            ancData: "0x",
          });
        }}
        ref={externalRef}
      >
        <ModalWrapper>
          <MiniHeader>Proposal</MiniHeader>
          <Proposal>{proposal}</Proposal>
          <MiniHeader>
            Ancillary Data (raw hexstring)
            <div
              className="copy-wrapper"
              onClick={() => {
                navigator.clipboard.writeText(ancData);
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
              }}
            >
              <FontAwesomeIcon style={{ marginLeft: "8px" }} icon={faCopy} />
              {copySuccess && (
                <span style={{ marginLeft: "16px" }}>Copied.</span>
              )}
            </div>
          </MiniHeader>
          <StateValueAncData>{ancData}</StateValueAncData>
          <MiniHeader>Description</MiniHeader>
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
            {umip?.url ? (
              <IconsItem>
                <a target="_blank" href={umip?.url} rel="noreferrer">
                  <Icon>
                    <CopyIcon />
                  </Icon>
                  Link to UMIP
                </a>
              </IconsItem>
            ) : null}
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
