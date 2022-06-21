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
  StateValueAddress,
  RevealHeader,
  RevealPercentage,
} from "./styled/DetailModals.styled";
import { ModalState } from "./ActiveRequests";
import { DiscordRed, CopyIcon } from "assets/icons";
import useUMIP from "./hooks/useUMIP";
import useOnboard from "common/hooks/useOnboard";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactTooltip from "react-tooltip";
import web3 from "web3";
import { VoteEvent } from "common/web3/types.web3";
import { VoteRevealed } from "common/web3/get/queryVotesRevealedEvents";
import has from "lodash.has";
import { getRequestMetaData } from "common/helpers/proposalTitleAndDescription/getRequestMetaData";

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
  revealedEvents: VoteRevealed[] | undefined | void;
  roundId: string;
  votingAddress: string | null;
}

const NULL_ANC_DATA = "0x";
const NULL_NUM_COMMITTED_VOTES = 0;
const NULL_PERCENTAGE = "0.00";

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
    revealedEvents,
    roundId,
    votingAddress,
  },
  externalRef
) => {
  const [numberCommittedVotes, setNumberCommittedVotes] = useState(
    NULL_NUM_COMMITTED_VOTES
  );
  const [numberRevealedAddresses, setNumberRevealedAddresses] = useState(0);
  const [revealPercentage, setRevealPercentage] = useState(NULL_PERCENTAGE);
  const [copySuccess, setCopySuccess] = useState(false);
  const [backupSeed, setBackupSeed] = useState("");

  // Note: because there is dynamic content, this will rebuild the tooltip for addressing the conditional
  // elements on the page. See ReactTooltip docs.
  useEffect(() => {
    ReactTooltip.rebuild();
  });

  useEffect(() => {
    const commits = localStorage.getItem("backupCommits");
    if (roundId && proposal && unix && votingAddress && commits && ancData) {
      try {
        const parsedJSON = JSON.parse(commits);
        const uniqueIdentifier = `${proposal}~${unix}~${ancData}`;
        if (
          has(parsedJSON, `${votingAddress}.[${roundId}].${uniqueIdentifier}`)
        ) {
          setBackupSeed(parsedJSON[votingAddress][roundId][uniqueIdentifier]);
        }
      } catch (err) {
        setBackupSeed("");
      }
    } else {
      setBackupSeed("");
    }
  }, [roundId, proposal, unix, votingAddress, ancData, committedVotes]);

  useEffect(() => {
    if (committedVotes && committedVotes.length && roundId && proposal) {
      const findCommitsForProposal = committedVotes.filter(
        (x) =>
          x.identifier === proposal && x.roundId === roundId && x.time === unix
      );

      const uniqueCommitsByAddress = new Set(findCommitsForProposal);
      setNumberCommittedVotes(uniqueCommitsByAddress.size);
    } else {
      setNumberCommittedVotes(NULL_NUM_COMMITTED_VOTES);
    }
  }, [committedVotes, roundId, proposal, unix]);

  useEffect(() => {
    if (revealedEvents && revealedEvents.length && roundId && proposal) {
      const findRevealsForProposal = revealedEvents.filter(
        (x) =>
          x.identifier === proposal && x.roundId === roundId && x.time === unix
      );

      setNumberRevealedAddresses(findRevealsForProposal.length);
    } else {
      setNumberRevealedAddresses(0);
    }
  }, [revealedEvents, roundId, proposal, unix]);

  useEffect(() => {
    if (numberCommittedVotes > 0) {
      const percentage = (
        (numberRevealedAddresses / numberCommittedVotes) *
        100
      ).toFixed(2);
      setRevealPercentage(percentage);
    } else {
      setRevealPercentage(NULL_PERCENTAGE);
    }
  }, [numberCommittedVotes, numberRevealedAddresses]);

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
  const { title, description } = getRequestMetaData(ancData, proposal, umip);

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
          <Proposal>{title}</Proposal>
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

          <MiniHeader>Unique Commit Addresses</MiniHeader>
          <StateValueAddress>{numberCommittedVotes}</StateValueAddress>

          <RevealHeader>
            {numberRevealedAddresses} Unique Reveal Addresses
          </RevealHeader>
          <RevealPercentage>
            {revealPercentage}% of Unique Commit Addresses
          </RevealPercentage>
          <MiniHeader>Proposal Timestamp</MiniHeader>
          <LastStateValue>
            <div data-for="active-modal-timestamp" data-tip={`UTC: ${unix}`}>
              {timestamp}
            </div>
            {backupSeed && <div>Backup Commit Salt: {backupSeed}</div>}
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
