import { ethers } from "ethers";
import createDesignatedVotingContractInstance from "common/utils/web3/createDesignatedVotingContractInstance";

export default async function createDesignatedVotingContract(
  address: string,
  signer: ethers.Signer,
  network: ethers.providers.Network
) {
  const dvcFactory = createDesignatedVotingContractInstance(
    signer,
    network.chainId.toString()
  );
  // console.log("DVC factory", dvcFactory);
  try {
    const tx = await dvcFactory.newDesignatedVoting(address);
    return tx;
  } catch (err) {
    console.log("err in factory creation", err);
  }
}
