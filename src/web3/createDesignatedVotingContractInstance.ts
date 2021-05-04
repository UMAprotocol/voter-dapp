// Instance of the voting contract -- different from the factory. This is used for voting interactions as a proxy if your address is signed up.

import DesignatedVotingArtifact from "@uma/core/build/contracts/DesignatedVoting.json";
import { ethers } from "ethers";

export default function createDesignatedVotingContractInstance(
  signer: ethers.Signer,
  contractAddress: string
) {
  const contract = new ethers.Contract(
    contractAddress,
    DesignatedVotingArtifact.abi,
    signer
  );

  return contract;
}
