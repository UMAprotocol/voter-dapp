import { ethers } from "ethers";
const UMA_MAINNET_CONTRACT_ADDRESS =
  "0x04fa0d235c4abf4bcf4787af4cf447de572ef828";

// Limited ERC-20 ABI
const abi = [
  "function balanceOf(address owner) view returns (uint)",
  "function transfer(address to, uint amount)",
  "event Transfer(address indexed from, address indexed to, uint amount)",
];

// Default to UMA Mainnet Contract Address.
export default function createERC20ContractInstance(
  signer: ethers.Signer,
  contractAddress = UMA_MAINNET_CONTRACT_ADDRESS
) {
  return new ethers.Contract(contractAddress, abi, signer);
}
