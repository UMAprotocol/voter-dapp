import { ethers } from "ethers";
import createERC20ContractInstance from "./web3/createERC20ContractInstance";

export default async function getUmaBalance(
  address: string,
  signer: ethers.Signer
) {
  const contract = createERC20ContractInstance(signer);
  const balance = await contract.balanceOf(address);

  return ethers.utils.formatUnits(balance, "ether");
}
