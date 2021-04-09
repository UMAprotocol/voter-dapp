import VotingArtifact from "@uma/core/build/contracts/Voting.json";
import { ethers } from "ethers";
console.log("VotingArt", VotingArtifact);
interface Network {
  [key: string]: {
    address: string;
    events: object;
    links: object;
    transactionHash: string;
  };
}

export default function createVotingContractInstance(
  signer: ethers.Signer,
  networkId: string
) {
  console.log("signer", signer);
  const artifact: Network = VotingArtifact.networks;
  const network = artifact[networkId];

  const contract = new ethers.Contract(
    network.address,
    VotingArtifact.abi,
    signer
  );

  return contract;
}
