import { ethers } from "ethers";

export function decodeAncillaryDataHexString(ancillaryDataHexString: string) {
  if (!ancillaryDataHexString.startsWith("0x")) {
    return null;
  }
  return ethers.utils.toUtf8String(ancillaryDataHexString);
}

export function getAncillaryDataTitle(
  decodedAncillaryData: string,
  titleToken = "title:",
  maxLength = 500
) {
  if (!decodedAncillaryData) {
    return null;
  }
  const ancillaryDataTitle = decodedAncillaryData.split(titleToken)[1];
  return ancillaryDataTitle?.slice(0, maxLength) ?? null;
}
