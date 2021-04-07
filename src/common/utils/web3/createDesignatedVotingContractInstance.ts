import DesignatedVotingArtifact from "@uma/core/build/contracts/DesignatedVotingFactory.json";
import { ethers } from "ethers";

export default function createDesignatedVotingContractInstance(
  signer: ethers.Signer,
  contractAddress: string = DesignatedVotingArtifact.networks["1"].address
) {
  const contract = new ethers.Contract(
    contractAddress,
    DesignatedVotingArtifact.abi,
    signer
  );

  return contract;
}
