import { ethers } from "ethers";

const ZERO_BALANCE = "0.0";

export default function calculateUMATotalValue(price: number, balance: string) {
  const formattedString = ethers.utils.commify(
    (price * Number(balance)).toFixed(2).toLocaleString()
  );
  if (formattedString !== ZERO_BALANCE) return formattedString;
  return "0.00";
}
