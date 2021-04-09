import { ethers } from "ethers";
import { infuraId } from "common/config";

let provider = new ethers.providers.JsonRpcProvider(
  `https://mainnet.infura.io/v3/${infuraId}`
);

if (process.env.REACT_APP_CURRENT_ENV === "kovan") {
  provider = new ethers.providers.JsonRpcProvider(
    `https://kovan.infura.io/v3/${infuraId}`
  );
}

if (process.env.REACT_APP_CURRENT_ENV === "test") {
  provider = new ethers.providers.JsonRpcProvider("http://localhost:9545");
}

export default provider;
