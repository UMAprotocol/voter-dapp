import { useState, useEffect } from "react";
import { ethers } from "ethers";
import createMulticallContractInstance from "common/web3/createMulticallContractInstance";

export default function useMulticall(
  signer: ethers.Signer | null,
  isConnected: boolean,
  network: ethers.providers.Network | null
) {
  const [multicallContract, setMulticallContract] =
    useState<ethers.Contract | null>(null);

  useEffect(() => {
    // If connected, try to create contract with assigned signer.
    if (isConnected) {
      // Signer can be null check for null and if we've already defined a contract.
      if (signer && !multicallContract && network) {
        const contract = createMulticallContractInstance(
          signer
          // network.chainId.toString()
        );
        setMulticallContract(contract);
      }
    }
  }, [isConnected, signer, multicallContract, network]);

  return { multicallContract };
}
