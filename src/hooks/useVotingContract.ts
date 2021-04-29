import { useState, useEffect } from "react";
import { ethers } from "ethers";
import createVotingContractInstance from "web3/createVotingContractInstance";
import createDesignatedVotingContractInstance from "web3/createDesignatedVotingContractInstance";

export default function useVotingContract(
  signer: ethers.Signer | null,
  isConnected: boolean,
  network: ethers.providers.Network | null,
  voterAddress: string | null,
  hotAddress: string | null
) {
  const [votingContract, setVotingContract] = useState<ethers.Contract | null>(
    null
  );

  const [
    designatedVotingContract,
    setDesignatedVotingContract,
  ] = useState<ethers.Contract | null>(null);

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
        if (hotAddress && voterAddress) {
          const dvc = createDesignatedVotingContractInstance(
            signer,
            voterAddress
          );
          setDesignatedVotingContract(dvc);
          // console.log("DVC in hook?", dvc);
        }
      }
    }
  }, [isConnected, signer, votingContract, network, hotAddress, voterAddress]);

  return { votingContract, designatedVotingContract };
}
