import { ethers } from "ethers";
import VotingTokenArtifact from "@uma/core/build/contracts/VotingToken.json";
console.log("VTA", VotingTokenArtifact);
// Limited ERC-20 ABI
const abi = [
  "function balanceOf(address owner) view returns (uint)",
  "function transfer(address to, uint amount)",
  "event Transfer(address indexed from, address indexed to, uint amount)",
];

interface Network {
  [key: string]: {
    address: string;
    events: object;
    links: object;
    transactionHash: string;
  };
}

// Default to UMA Mainnet Contract Address.
export default function createERC20ContractInstance(
  signer: ethers.Signer,
  networkId: string
) {
  const artifact: Network = VotingTokenArtifact.networks;
  const network = artifact[networkId];

  return new ethers.Contract(network.address, abi, signer);
}
