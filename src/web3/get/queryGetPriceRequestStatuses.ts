// getPriceRequestStatuses((bytes32,uint256,bytes)[])
import { ethers } from "ethers";

import { PendingRequestAncillary } from "web3/types.web3";

export const queryGetPriceRequestStatuses = async (
  contract: ethers.Contract,
  data: PendingRequestAncillary[]
) => {
  try {
    const tx = await contract.functions[
      "getPriceRequestStatuses((bytes32,uint256,bytes)[])"
    ](data);
    if (tx.length) {
      console.log("tx", tx);
      return tx;
    } else {
      return [];
    }
  } catch (err) {
    console.log("err", err);
  }
};
