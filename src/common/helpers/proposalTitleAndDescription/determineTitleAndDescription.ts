import { UMIP } from "features/vote/helpers/fetchUMIP";
import {
  decodeAncillaryDataHexString,
  getAncillaryDataTitle,
  getAncillaryDataDescription,
} from "./ancillaryData";

/** Finds a title and description for a proposal.
 * 
 * 
 */
export function determineTitleAndDescription(
  ancillaryData: string,
  proposal: string,
  isUmip: boolean,
  umip?: UMIP
) {
  const decodedAncillaryData = decodeAncillaryDataHexString(ancillaryData);
  const ancillaryDataTitle = getAncillaryDataTitle(decodedAncillaryData ?? "");
  const ancillaryDataDescription = getAncillaryDataDescription(
    decodedAncillaryData ?? ""
  );

  // description is derived from either the umip description defined in contentful (if it is an umip)
  // or it is the ancillary data decoded from the ancillary data hex string
  let title;
  let description;

  // use umip description if it exists
  if (isUmip && umip?.title) {
    title = umip?.title;
    // otherwise use the decoded ancillary data
  } else if (ancillaryDataTitle) {
    title = ancillaryDataTitle;
    // if all else fails, use the empty placeholder
  } else {
    title = proposal;
  }

  // use umip description if it exists
  if (isUmip && umip?.description) {
    description = umip?.description;
    // otherwise use the decoded ancillary data
  } else if (ancillaryDataDescription) {
    description = ancillaryDataDescription;
    // if all else fails, use the empty placeholder
  } else {
    description = `No description was found for this ${
      isUmip ? "umip" : "request"
    }.`;
  }

  return { title, description };
}
