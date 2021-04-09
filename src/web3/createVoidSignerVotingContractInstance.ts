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

export default function createVoidSignerVotingContractInstance(
  provider: ethers.providers.JsonRpcProvider,
  networkId: string
) {
  const artifact: Network = VotingArtifact.networks;
  const network = artifact[networkId];
  const signer = new ethers.VoidSigner(network.address, provider);

  const contract = new ethers.Contract(
    network.address,
    VotingArtifact.abi,
    signer
  );

  return contract;
}
