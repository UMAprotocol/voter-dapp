import { ethers } from "ethers";
import stringToBytes32 from "common/utils/web3/stringToBytes32";

export const queryRetrieveRewards = async (
  contract: ethers.Contract,
  address: string,
  roundId: string,
  identifier: string,
  time: string
) => {
  try {
    const reward: ethers.BigNumber = await contract.callStatic[
      "retrieveRewards(address,uint256,(bytes32,uint256)[])"
    ](address, Number(roundId), [
      { identifier: stringToBytes32(identifier), time: Number(time) },
    ]);

    return ethers.utils.formatEther(reward.toString());
  } catch (err) {
    console.log("err", err);
  }
};

export interface PendingRequest {
  time: string;
  identifier: string;
  ancillaryData: string;
  idenHex: string;
  timeBN: ethers.BigNumber;
}

const NULL_ANC_DATA = "0x";

export const queryGetPendingRequests = async (contract: ethers.Contract) => {
  // console.log("contract", contract);
  try {
    const requests: Array<
      Array<[string, ethers.BigNumber, string]>
    > = await contract.functions.getPendingRequests();
    if (requests.length) {
      console.log("requests", requests);
      const values = [] as PendingRequest[];
      requests.forEach((el) => {
        if (el.length) {
          el.forEach((x) => {
            const datum = {} as PendingRequest;
            datum.identifier = ethers.utils.toUtf8String(x[0]);
            datum.time = x[1].toString();
            datum.timeBN = x[1];
            datum.ancillaryData =
              x[2] !== NULL_ANC_DATA ? ethers.utils.toUtf8String(x[2]) : "-";
            values.push(datum);
            datum.idenHex = x[0];
          });
        }
      });
      return values;
    } else {
      return [] as PendingRequest[];
    }
  } catch (err) {
    console.log("err", err);
    throw new Error(err.message);
  }
};

export enum VotePhases {
  COMMIT,
  REVEAL,
}

export const queryGetVotePhase = async (contract: ethers.Contract) => {
  try {
    const phase: VotePhases[] = await contract.functions.getVotePhase();
    if (phase.length) {
      if (phase[0] === VotePhases.COMMIT) return "Commit";
      if (phase[0] === VotePhases.REVEAL) return "Reveal";
    } else {
      return "";
    }
  } catch (err) {
    console.log("err", err);
  }
};

export const queryVoteTiming = async (contract: ethers.Contract) => {
  try {
    const timing = await contract.functions.voteTiming();
    if (timing.length) {
      const timingToString = ethers.BigNumber.from(timing[0]).toString();
      return timingToString;
    }
  } catch (err) {
    console.log("err", err);
  }
};

export const queryCurrentRoundId = async (contract: ethers.Contract) => {
  try {
    const roundId = await contract.functions.getCurrentRoundId();
    if (roundId.length) {
      const roundIdToString = ethers.BigNumber.from(roundId[0]).toString();
      return roundIdToString;
    }
  } catch (err) {
    console.log("err", err);
  }
};

export const quertRequestPrice = async (
  contract: ethers.Contract,
  identifier: string,
  time: string,
  ancillaryData: string
) => {
  try {
  } catch (err) {
    console.log("err", err);
  }
};

// if SnapshotId is zero, no snapshot has taken place; otherwise it has.
export interface Round {
  snapshotId: string;
}

export const queryRounds = async (
  contract: ethers.Contract,
  roundId: number
) => {
  try {
    const tx = await contract.functions.rounds(roundId);
    if (tx.length) {
      const datum = {} as Round;
      const snapshotId = tx[0] as ethers.BigNumber;

      datum.snapshotId = snapshotId.toString();

      return datum;
    } else {
      return {} as Round;
    }
  } catch (err) {
    console.log("err", err);
  }
};
