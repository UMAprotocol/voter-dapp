import OldVotingArtifact from "@uma/core-1-2-2/build/contracts/Voting.json";
import { ethers } from "ethers";

// We need this because the ABI for the Voting Contract has changed.
// And we need to collect reward events from previous contracts for display.
export default function createOldVotingContractInstance(
  signer: ethers.Signer,
  contractAddress: string
) {
  const contract = new ethers.Contract(
    contractAddress,
    OldVotingArtifact.abi,
    signer
  );

  return contract;
}
