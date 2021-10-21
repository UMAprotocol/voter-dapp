import { ethers } from "ethers";
import * as reveal from "../src/common/helpers/reveal";
import prompt from "prompt";

type Config = {
  network: string;
  roundId?: string;
  publicAddress?: string;
  privateKey?: string;
};
export default async (config: Config) => {
  prompt.start();
  const promptConfig = [
    {
      name: "publicAddress",
      description: "Enter your voting public address",
      required: true,
      default: config.publicAddress,
    },
    {
      name: "privateKey",
      description: "Enter your signed keys private key",
      required: true,
      default: config.privateKey,
    },
  ];
  const { publicAddress, privateKey } = await prompt.get(promptConfig);
  const provider = ethers.getDefaultProvider(
    ethers.providers.getNetwork(Number(config.network))
  );
  return reveal.encodeWithPrivateKey(
    provider as unknown as ethers.Signer,
    config.network,
    publicAddress.toString(),
    privateKey.toString(),
    config.roundId
  );
};
