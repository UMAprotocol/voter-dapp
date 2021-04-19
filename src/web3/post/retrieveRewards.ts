import { ethers } from "ethers";

interface PostRetrieveRewards {}
export const retrieveRewards = async (
  contract: ethers.Contract,
  data: PostRetrieveRewards[]
) => {
  try {
    const tx = await contract.functions[
      "retrieveRewards(address,uint256,(bytes32,uint256,bytes)[])"
    ](data);
    console.log("retrieve rewards TX?", tx);
    return tx;
  } catch (err) {
    console.log("Err in attempted retrieveRewards transaction", err);
  }
};
