import DesignatedVotingArtifact from "@uma/core/build/contracts/DesignatedVotingFactory.json";

import { ethers } from "ethers";

interface Network {
  [key: string]: {
    address: string;
    events: object;
    links: object;
    transactionHash: string;
  };
}

export default function createDesignatedVotingContractInstance(
  signer: ethers.Signer,
  networkId: string
) {
  const artifact: Network = DesignatedVotingArtifact.networks;
  const network = artifact[networkId];

  const contract = new ethers.Contract(
    network?.address ?? "",
    DesignatedVotingArtifact.abi,
    signer
  );

  return contract;
}
