import { ethers } from "ethers";
import createDesignatedVotingContractFactoryInstance from "common/utils/web3/createDesignatedVotingContractFactoryInstance";

export default async function createDesignatedVotingContract(
  address: string,
  signer: ethers.Signer,
  network: ethers.providers.Network
) {
  const dvcFactory = createDesignatedVotingContractFactoryInstance(
    signer,
    network.chainId.toString()
  );
  try {
    const tx = await dvcFactory.newDesignatedVoting(address);
    return tx;
  } catch (err) {
    console.log("err in factory creation", err);
  }
}
