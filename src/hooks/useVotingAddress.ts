import { useState, useEffect } from "react";
import { ethers } from "ethers";
import createDesignatedVotingContractInstance from "common/utils/web3/createDesignatedVotingContractInstance";

// Need to determine if user is using a two key contract.
// Return their hot wallet address and cold wallet address.
export default function useVotingAddress(
  address: string | null,
  signer: ethers.Signer | null
) {
  const [votingAddress, setVotingAddress] = useState<string | null>(null);
  const [hotAddress, setHotAddress] = useState<string | null>(null);

  useEffect(() => {
    if (address && signer) {
      const designatedContract = createDesignatedVotingContractInstance(signer);
      designatedContract
        .designatedVotingContracts(address)
        .then((res: string) => {
          if (res === NULL_ADDRESS) {
            setVotingAddress(address);
          } else {
            setVotingAddress(res);
            setHotAddress(address);
          }
        });
    }
    setVotingAddress(address);
  }, [address, signer]);

  return {
    votingAddress,
    hotAddress,
  };
}

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
