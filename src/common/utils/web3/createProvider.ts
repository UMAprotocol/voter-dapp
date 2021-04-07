import { ethers } from "ethers";
import { infuraId } from "common/config";

const provider = new ethers.providers.JsonRpcProvider(
  `https://mainnet.infura.io/v3/${infuraId}`
);

export default provider;
