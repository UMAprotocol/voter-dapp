import { ethers } from "ethers";
import ERC20TestnetArtifact from "@uma/core/build/contracts/TestnetERC20.json";
const UMA_MAINNET_CONTRACT_ADDRESS =
  "0x04fa0d235c4abf4bcf4787af4cf447de572ef828";
const MAINNET_NETWORK_ID = "1";

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
  // Apparently the mainnet address doesn't live on the same artifact
  if (networkId !== MAINNET_NETWORK_ID) {
    const artifact: Network = ERC20TestnetArtifact.networks;
    const network = artifact[networkId];
    return new ethers.Contract(network.address, abi, signer);
  } else {
    return new ethers.Contract(UMA_MAINNET_CONTRACT_ADDRESS, abi, signer);
  }
}
