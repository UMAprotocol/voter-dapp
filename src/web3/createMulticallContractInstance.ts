import MulticallAtrifact from "@uma/core/build/contracts/MulticallMock.json";
import { ethers } from "ethers";

// interface Network {
//   [key: string]: {
//     address: string;
//     events: object;
//     links: object;
//     transactionHash: string;
//   };
// }

// We need to query the data before a user has logged in
// Because the provider doesn't have a default signer, we provide one with Void Signer, which creates a read only signer.
// See: https://docs.ethers.io/v5/api/signer/#VoidSigner
export default function createMulticallContractInstance(
  signer: ethers.Signer
  // networkId: string
) {
  // const artifact: Network = MulticallAtrifact.networks;
  // const network = artifact[networkId];
  // console.log("network", network, "artifact", artifact, MulticallAtrifact);

  const contract = new ethers.Contract(
    // network.address,
    // This is stubbed in for now. We need to develop this formally for mainnet / kovan.
    process.env.REACT_APP_CURRENT_ENV === "test"
      ? "0xD6b61cAd80DBe2Fe26Fa672b8Ec2FdAf002CeBbC"
      : "",
    MulticallAtrifact.abi,
    signer
  );

  return contract;
}
