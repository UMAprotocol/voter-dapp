import { ethers } from "ethers";

export interface PendingRequest {
  time: string;
  identifier: string;
  ancillaryData: string;
  idenHex: string;
  timeBN: ethers.BigNumber;
}

export interface VoteEvent {
  address: string;
  roundId: string;
  identifier: string;
  time: string;
  ancillaryData: string;
}

export interface PendingRequestAncillary {
  // bytes32: hexstring or bytes array
  identifier: string | Uint8Array;
  time: string | number;
  // hexstring
  ancillaryData: string;
}

