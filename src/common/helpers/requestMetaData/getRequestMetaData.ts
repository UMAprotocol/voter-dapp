import { UMIP } from "features/vote/helpers/fetchUMIP";
import {
  decodeAncillaryDataHexString,
  getTitleFromAncillaryData,
  getDescriptionFromAncillaryData,
} from "./ancillaryData";
import approvedIdentifiers from "./approvedIdentifiersTable.json";

type RequestMetaData = {
  title: string;
  description: string;
  umipUrl?: string;
};

/** Finds a title and description, and UMIP link (if it exists) for a proposal.
 *
 * There are 3 different sources of this data, depending on the proposal type:
 *
 * 1. For UMIPs, the title, description and UMIP link come from Contentful.
 * 2. For requests for approved price identifiers, the title, description, and UMIP link come from the hard-coded `approvedIdentifiersTable` json file.
 * 3. For requests from Polymarket, the title and description come from the proposal's ancillary data (note that there is no UMIP link here).
 */
export function getRequestMetaData(
  ancillaryData: string,
  proposal: string,
  umip?: UMIP
): RequestMetaData {
  // if we are dealing with a UMIP, get the title, description and UMIP url from Contentful
  const isUmip = proposal.includes("Admin");
  if (isUmip) {
    return {
      title: umip?.title ?? proposal,
      description:
        umip?.description ?? "No description was found for this UMIP.",
      umipUrl: umip?.umipLink,
    };
  }

  // if we are dealing with a request for an approved price identifier, get the title, description and UMIP url from the hard-coded approvedIdentifiersTable json file
  // we know we are dealing with a request for an approved price identifier if the proposal matches an approved identifier's title
  const identifierDetails = approvedIdentifiers.find(
    (id) => proposal === id.title
  );
  const identifiersToIgnore = [
    "YES_OR_NO_QUERY"
  ]
  const isApprovedIdentifier = Boolean(identifierDetails) && !identifiersToIgnore.includes(proposal);
  if (isApprovedIdentifier) {
    return {
      title: identifierDetails?.title ?? proposal,
      description:
        identifierDetails?.summary ??
        "No description was found for this request.",
      umipUrl: identifierDetails?.umipLink.url,
    };
  }

  // if the previous checks fail, we assume we are dealing with a Polymarket request
  // note that `umipUrl` is undefined in this case, as there is no UMIP to link to for this type of request

  let decodedAncillaryData = "";

  try {
    decodedAncillaryData = decodeAncillaryDataHexString(ancillaryData);
  } catch (e) {
    console.error(e);
  }

  const ancillaryDataTitle = getTitleFromAncillaryData(decodedAncillaryData);
  const ancillaryDataDescription =
    getDescriptionFromAncillaryData(decodedAncillaryData);

  return {
    title: ancillaryDataTitle ?? proposal,
    description:
      ancillaryDataDescription ?? "No description was found for this request.",
    umipUrl: undefined,
  };
}
