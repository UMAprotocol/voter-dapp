import MulticallArtifact from "@uma/core/build/contracts/Multicall.json";
import { ethers } from "ethers";

interface MulticallAddress {
  [key: string]: {
    multicall: string;
    rpcUrl: string;
  };
}

const multicallAddresses: MulticallAddress = {
  main: {
    multicall: "0xeefba1e63905ef1d7acba5a8513c70307c1ce441",
    rpcUrl: "https://mainnet.infura.io",
  },
  kovan: {
    multicall: "0x2cc8688c5f75e365aaeeb4ea8d6a480405a48d2a",
    rpcUrl: "https://kovan.infura.io",
  },
  rinkeby: {
    multicall: "0x42ad527de7d4e9d9d011ac45b31d8551f8fe9821",
    rpcUrl: "https://rinkeby.infura.io",
  },
  goerli: {
    multicall: "0x77dca2c955b15e9de4dbbcf1246b4b85b651e50e",
    rpcUrl: "https://rpc.slock.it/goerli",
  },
  xdai: {
    multicall: "0xb5b692a88bdfc81ca69dcb1d924f59f0413a602a",
    rpcUrl: "https://dai.poa.network",
  },
  // Note: the address here is *not* constant. You must add your own address into your local ganache.
  test: {
    multicall: process.env.REACT_APP_TEST_MULTICALL_ADDRESS
      ? process.env.REACT_APP_TEST_MULTICALL_ADDRESS
      : "",
    // voterdapp testrpc
    rpcUrl: "http://127.0.0.1:9545",
  },
};

// We need to query the data before a user has logged in
// Because the provider doesn't have a default signer, we provide one with Void Signer, which creates a read only signer.
// See: https://docs.ethers.io/v5/api/signer/#VoidSigner
export default function createMulticallContractInstance(signer: ethers.Signer) {
  const contract = new ethers.Contract(
    multicallAddresses[
      process.env.REACT_APP_CURRENT_ENV
        ? process.env.REACT_APP_CURRENT_ENV
        : "main"
    ].multicall,
    MulticallArtifact.abi,
    signer
  );

  return contract;
}
