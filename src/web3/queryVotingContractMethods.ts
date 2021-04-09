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
}

const NULL_ANC_DATA = "0x";

export const queryGetPendingRequests = async (contract: ethers.Contract) => {
  // console.log("contract", contract);
  try {
    const requests: Array<
      Array<[string, ethers.BigNumber, string]>
    > = await contract.functions.getPendingRequests();

    // console.log("requests gets here?", requests);
    if (requests.length) {
      const values = [] as PendingRequest[];
      requests.forEach((el) => {
        if (el.length) {
          el.forEach((x) => {
            const datum = {} as PendingRequest;
            datum.identifier = ethers.utils.toUtf8String(x[0]);
            datum.time = x[1].toString();
            datum.ancillaryData =
              x[2] !== NULL_ANC_DATA ? ethers.utils.toUtf8String(x[2]) : "-";
            values.push(datum);
          });
        }
      });
      return values;
    } else {
      return [] as PendingRequest[];
    }
  } catch (err) {
    console.log("err", err);
  }
};

export const queryGetVotePhase = async (contract: ethers.Contract) => {
  try {
    const phase = await contract.function.getVotePhase();
    console.log("phase", phase);
  } catch (err) {
    console.log("err", err);
  }
};
