import { ethers } from "ethers";
import { UMIP } from "features/vote/helpers/fetchUMIP";

export function decodeAncillaryDataHexString(ancillaryDataHexString: string) {
  if (!ancillaryDataHexString.startsWith("0x")) {
    return null;
  }
  return ethers.utils.toUtf8String(ancillaryDataHexString);
}

export function getAncillaryDataTitle(
  decodedAncillaryData: string,
  titleIdentifier = "title:",
  descriptionIdentifier = "description:"
) {
  if (!decodedAncillaryData) {
    return null;
  }
  const start = decodedAncillaryData.indexOf(titleIdentifier);
  const end =
    decodedAncillaryData.indexOf(descriptionIdentifier) ??
    decodedAncillaryData.length;

  if (start === -1) {
    return null;
  }

  return decodedAncillaryData.substring(start + titleIdentifier.length, end);
}

export function getAncillaryDataDescription(
  decodedAncillaryData: string,
  descriptionIdentifier = "description:"
) {
  if (!decodedAncillaryData) {
    return null;
  }
  const start = decodedAncillaryData.indexOf(descriptionIdentifier);
  const end = decodedAncillaryData.length;

  if (start === -1) {
    return null;
  }

  return decodedAncillaryData.substring(
    start + descriptionIdentifier.length,
    end
  );
}

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
