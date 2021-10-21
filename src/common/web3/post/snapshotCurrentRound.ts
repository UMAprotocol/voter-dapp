import { ethers } from "ethers";

export const snapshotCurrentRound = async (
  contract: ethers.Contract,
  signature: string
) => {
  try {
    const tx = await contract.functions["snapshotCurrentRound(bytes)"](
      signature
    );
    // console.log("Snapshot worked?", tx);
    return tx;
  } catch (err) {
    console.log("err in Snapshot", err);
  }
};
