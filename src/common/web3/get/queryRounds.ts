import { ethers } from "ethers";
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
