import { ethers } from "ethers";
import { infuraId } from "common/config";

let provider = new ethers.providers.JsonRpcProvider(
  `https://mainnet.infura.io/v3/${infuraId}`
);

if (process.env.REACT_APP_TESTING_GANACHE) {
  provider = new ethers.providers.JsonRpcProvider("http://localhost:9545");
}

export default provider;
