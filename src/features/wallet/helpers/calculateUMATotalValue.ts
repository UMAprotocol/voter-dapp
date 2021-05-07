import { ethers } from "ethers";

const ZERO_BALANCE = "0.0";

export default function calculateUMATotalValue(price: number, balance: string) {
  let formattedString = ethers.utils.commify(
    (price * Number(balance)).toFixed(2).toLocaleString()
  );

  // Make sure to add a trailing zero for dollars if the cents is only 1 digit.
  if (formattedString.split(".")[1].length === 1) {
    const split = formattedString.split(".");
    const rightSide = `${split[1]}0`;
    const leftSide = split[0];
    formattedString = `${leftSide}.${rightSide}`;
  }

  if (formattedString !== ZERO_BALANCE) return formattedString;
  return "0.00";
}
