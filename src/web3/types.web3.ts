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
