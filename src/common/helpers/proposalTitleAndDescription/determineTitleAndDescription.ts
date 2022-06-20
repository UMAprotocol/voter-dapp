import { UMIP } from "features/vote/helpers/fetchUMIP";
import {
  decodeAncillaryDataHexString,
  getTitleFromAncillaryData,
  getDescriptionFromAncillaryData,
} from "./ancillaryData";
import approvedIdentifiers from "./approvedIdentifiersTable.json";

/** Finds a title and description for a proposal.
 *
 * There are 3 different sources of this data, depending on the proposal type:
 *
 * 1. For UMIPs, the title and description comes from Contentful.
 * 2. For requests for approved price identifiers, the title and description comes from the hard-coded `approvedIdentifiersTable` json file.
 * 3. For requests from Polymarket, the title and description comes from the proposal's ancillary data.
 */
export function determineTitleAndDescription(
  ancillaryData: string,
  proposal: string,
  umip?: UMIP
) {
  const isUmip = proposal.includes("Admin");

  if (isUmip) {
    return {
      title: umip?.title ?? proposal,
      description:
        umip?.description ?? "No description was found for this UMIP.",
    };
  }

  const identifierDetails = approvedIdentifiers.find(
    (id) => proposal === id.title
  );
  const isApprovedIdentifier = Boolean(identifierDetails);

  if (isApprovedIdentifier) {
    return {
      title: identifierDetails?.title ?? proposal,
      description:
        identifierDetails?.summary ??
        "No description was found for this request.",
    };
  }

  const decodedAncillaryData = decodeAncillaryDataHexString(ancillaryData);
  const ancillaryDataTitle = getTitleFromAncillaryData(
    decodedAncillaryData ?? ""
  );
  const ancillaryDataDescription = getDescriptionFromAncillaryData(
    decodedAncillaryData ?? ""
  );

  return {
    title: ancillaryDataTitle ?? proposal,
    description:
      ancillaryDataDescription ?? "No description was found for this request.",
  };
}
