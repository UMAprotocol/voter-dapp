import { ethers } from "ethers";
const MAINNET_CONTRACT_ADDRESS = "0x04fa0d235c4abf4bcf4787af4cf447de572ef828";

// Limited ERC-20 ABI
const abi = [
  "function balanceOf(address owner) view returns (uint)",
  "function transfer(address to, uint amount)",
  "event Transfer(address indexed from, address indexed to, uint amount)",
];

export default function createERC20ContractInstance(signer: ethers.Signer) {
  return new ethers.Contract(MAINNET_CONTRACT_ADDRESS, abi, signer);
}
