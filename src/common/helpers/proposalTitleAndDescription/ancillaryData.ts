import { ethers } from "ethers";

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
