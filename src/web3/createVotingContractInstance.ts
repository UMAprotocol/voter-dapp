import VotingArtifact from "@uma/core/build/contracts/Voting.json";
import { ethers } from "ethers";

export default function createVotingContractInstance(
  signer: ethers.Signer,
  contractAddress: string = VotingArtifact.networks["1"].address
) {
  const contract = new ethers.Contract(
    contractAddress,
    VotingArtifact.abi,
    signer
  );

  return contract;
}
