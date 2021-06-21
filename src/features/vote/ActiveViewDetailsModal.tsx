import {
  ForwardRefRenderFunction,
  PropsWithChildren,
  forwardRef,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
} from "react";
import ReactMarkdown from "react-markdown";
import Modal from "common/components/modal";
import {
  ModalWrapper,
  MiniHeader,
  Proposal,
  Description,
  IconsWrapper,
  StateValueAncData,
  IconsItem,
  Icon,
  LastStateValue,
} from "./styled/DetailModals.styled";
import { ModalState } from "./ActiveRequests";
import { DiscordRed, CopyIcon } from "assets/icons";
import useUMIP from "./useUMIP";
import useOnboard from "common/hooks/useOnboard";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactTooltip from "react-tooltip";
import web3 from "web3";
import { VoteEvent } from "web3/types.web3";

interface Props {
  isOpen: boolean;
  close: () => void;
  ref: (node: HTMLElement | null) => void;
  setModalState: Dispatch<SetStateAction<ModalState>>;
  proposal: string;
  timestamp: string;
  ancData: string;
  unix: string;
  committedVotes: VoteEvent[] | undefined | void;
}

const NULL_ANC_DATA = "0x";

const _ActiveViewDetailsModal: ForwardRefRenderFunction<
  HTMLElement,
  PropsWithChildren<Props>
> = (
  {
    isOpen,
    close,
    proposal,
    setModalState,
    timestamp,
    ancData,
    unix,
    committedVotes,
  },
  externalRef
) => {
  const [copySuccess, setCopySuccess] = useState(false);
  // Note: because there is dynamic content, this will rebuild the tooltip for addressing the conditional
  // elements on the page. See ReactTooltip docs.
  useEffect(() => {
    ReactTooltip.rebuild();
  });

  const [convertedHexstring, setConvertedHexstring] = useState("");

  useEffect(() => {
    if (ancData !== NULL_ANC_DATA) {
      let ancDataToString = "";
      try {
        ancDataToString = web3.utils.hexToString(ancData);
      } catch (err) {
        ancDataToString = "";
      }
      setConvertedHexstring(ancDataToString);
    } else {
      setConvertedHexstring("");
    }
  }, [ancData]);

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
            unix: "",
          });
        }}
        ref={externalRef}
      >
        <ModalWrapper>
          <MiniHeader>Proposal</MiniHeader>
          <Proposal>{proposal}</Proposal>
          {ancData !== NULL_ANC_DATA && (
            <>
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
                  <FontAwesomeIcon
                    style={{ marginLeft: "8px" }}
                    icon={faCopy}
                  />
                  {copySuccess && (
                    <span style={{ marginLeft: "16px" }}>Copied.</span>
                  )}
                </div>
              </MiniHeader>
              <StateValueAncData>{ancData}</StateValueAncData>
            </>
          )}

          {convertedHexstring && ancData !== NULL_ANC_DATA && (
            <>
              <MiniHeader>Ancillary Data (converted)</MiniHeader>
              <StateValueAncData>{convertedHexstring}</StateValueAncData>
            </>
          )}
          {ancData !== NULL_ANC_DATA && convertedHexstring === "" && (
            <>
              <MiniHeader>Ancillary Data (converted)</MiniHeader>
              <StateValueAncData>
                This data is not in UTF8 format and could not be properly
                displayed.
              </StateValueAncData>
            </>
          )}
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
            {umip?.umipLink ? (
              <IconsItem>
                <a target="_blank" href={umip?.umipLink} rel="noreferrer">
                  <Icon>
                    <CopyIcon />
                  </Icon>
                  Link to UMIP
                </a>
              </IconsItem>
            ) : null}
          </IconsWrapper>

          <MiniHeader>Proposal Timestamp</MiniHeader>
          <LastStateValue
            data-for="active-modal-timestamp"
            data-tip={`UTC: ${unix}`}
          >
            {timestamp}
          </LastStateValue>
        </ModalWrapper>
        <ReactTooltip
          id="active-modal-timestamp"
          place="top"
          type="dark"
          effect="float"
        />
      </Modal>
    </>
  );
};

const ActiveViewDetailsModal = forwardRef(_ActiveViewDetailsModal);
ActiveViewDetailsModal.displayName = "ActiveViewDetailsModal";

export default ActiveViewDetailsModal;
