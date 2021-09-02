import { useState, useEffect } from "react";
import { ethers } from "ethers";
import createDesignatedVotingContractFactoryInstance from "common/utils/web3/createDesignatedVotingContractFactoryInstance";

// Need to determine if user is using a two key contract.
// Return their hot wallet address and cold wallet address.
export default function useVotingAddress(
  address: string | null,
  signer: ethers.Signer | null,
  network: ethers.providers.Network | null
) {
  const [votingAddress, setVotingAddress] = useState<string | null>(null);
  const [hotAddress, setHotAddress] = useState<string | null>(null);

  useEffect(() => {
    if (address && signer && network && network.chainId) {
      const designatedContract = createDesignatedVotingContractFactoryInstance(
        signer,
        network.chainId.toString()
      );
      designatedContract
        .designatedVotingContracts(address)
        .then((res: string) => {
          if (res === NULL_ADDRESS) {
            setVotingAddress(address);
            setHotAddress(null);
          } else {
            setVotingAddress(res);
            setHotAddress(address);
          }
        }).catch((err:Error)=>{
          console.error('Error getting designated voting address:',err)
        });
    } else {
      setVotingAddress(null);
    }
  }, [address, signer, network]);

  return {
    votingAddress,
    hotAddress,
  };
}

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
