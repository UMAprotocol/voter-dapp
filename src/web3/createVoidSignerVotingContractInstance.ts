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

// We need to query the data before a user has logged in
// Because the provider doesn't have a default signer, we provide one with Void Signer, which creates a read only signer.
// See: https://docs.ethers.io/v5/api/signer/#VoidSigner
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
