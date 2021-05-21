import { ethers } from "ethers";
// import { PendingRequest } from "../types.web3";

const NULL_ANC_DATA = "0x";

export interface PendingRequest {
  time: string;
  identifier: string;
  ancillaryData: string;
  idenHex: string;
  timeBN: ethers.BigNumber;
  ancHex: string;
}

export const queryGetPendingRequests = async (contract: ethers.Contract) => {
  // console.log("contract", contract);
  try {
    const requests: Array<Array<[string, ethers.BigNumber, string]>> =
      await contract.functions.getPendingRequests();
    if (requests.length) {
      const values = [] as PendingRequest[];
      requests.forEach((el) => {
        if (el.length) {
          el.forEach((x) => {
            const datum = {} as PendingRequest;
            datum.identifier = ethers.utils.toUtf8String(x[0]);
            datum.time = x[1].toString();
            datum.timeBN = x[1];
            values.push(datum);
            datum.idenHex = x[0];
            let ancData = "-";
            if (x[2] !== NULL_ANC_DATA) {
              try {
                ancData = ethers.utils.toUtf8String(x[2]);
              } catch (err) {
                console.log("Invalid ancillaryData coding");
                ancData = "Bad anc data encoding.";
              }
            }
            datum.ancillaryData = ancData;
            datum.ancHex = x[2];
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
