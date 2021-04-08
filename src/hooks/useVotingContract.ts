import { useState, useEffect } from "react";
import { ethers } from "ethers";
import createVotingContractInstance from "web3/createVotingContractInstance";

export default function useVotingContract(
  signer: ethers.Signer | null,
  isConnected: boolean,
  network: ethers.providers.Network | null
) {
  const [votingContract, setVotingContract] = useState<ethers.Contract | null>(
    null
  );

  useEffect(() => {
    // If connected, try to create contract with assigned signer.
    if (isConnected) {
      // Signer can be null check for null and if we've already defined a contract.
      if (signer && !votingContract && network) {
        const contract = createVotingContractInstance(
          signer,
          network.chainId.toString()
        );
        setVotingContract(contract);
      }
    }
  }, [isConnected, signer, votingContract]);

  return { votingContract };
}
