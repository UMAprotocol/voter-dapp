import { ethers } from "ethers";
import createERC20ContractInstance from "./web3/createERC20ContractInstance";

export default async function getUmaBalance(
  address: string,
  signer: ethers.Signer
) {
  const contract = createERC20ContractInstance(signer);
  const balance = await contract.balanceOf(address);
  const formattedBalance = ethers.utils.formatUnits(balance, "ether");

  // We format this string elsewhere. Return "0" instead of having the formatter added a decimal.
  if (formattedBalance === "0.0") return "0";
  return formattedBalance;
}
