import { ethers } from "ethers";

export default function stringToBytes32(str: string) {
  const bytes = ethers.utils.toUtf8Bytes(str);
  if (bytes.length > 31) {
    throw new Error("too long");
  }
  return ethers.utils.concat([bytes, Zeros]).slice(0, 32);
}

const Zeros =
  "0x0000000000000000000000000000000000000000000000000000000000000000";
