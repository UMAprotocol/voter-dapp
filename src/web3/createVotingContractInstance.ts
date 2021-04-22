import VotingArtifact from "@uma/core/build/contracts/Voting.json";
import { ethers } from "ethers";

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
  const artifact: Network = VotingArtifact.networks;
  const network = artifact[networkId];

  const contract = new ethers.Contract(
    network.address,
    VotingArtifact.abi,
    signer
  );

  console.log("VC", contract);
  return contract;
}
