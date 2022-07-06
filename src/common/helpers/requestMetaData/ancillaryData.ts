import { ethers } from "ethers";

export function decodeAncillaryDataHexString(ancillaryDataHexString: string) {
  try {
    return ethers.utils.toUtf8String(ancillaryDataHexString);
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`Invalid ancillary data hex string: ${e.message}`);
    } else {
      throw new Error(`Invalid ancillary data hex string: ${e}`);
    }
  }
}

export function getTitleFromAncillaryData(
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

export function getDescriptionFromAncillaryData(
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
