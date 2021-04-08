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

export const queryGetPendingRequests = async (contract: ethers.Contract) => {
  try {
    const requests: Array<
      Array<[string, ethers.BigNumber, string]>
    > = await contract.functions.getPendingRequests();

    if (requests.length) {
      const values = [] as PendingRequest[];
      requests.forEach((el, index) => {
        if (el.length) {
          el.forEach((x) => {
            const datum = {} as PendingRequest;
            datum.identifier = ethers.utils.toUtf8String(x[0]);
            datum.time = x[1].toString();
            datum.ancillaryData = ethers.utils.toUtf8String(x[2]);
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
