import { ethers } from "ethers";
import * as reveal from "../src/common/helpers/reveal";
import prompt from "prompt";
import fs from "fs";

type Config = {
  network: string;
  roundId?: string;
  publicAddress?: string;
  backupCommitsFile?: string;
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
      name: "backupCommitsFile",
      description:
        "Enter a path to file containing the full salt object copied from local storage",
      default: config.backupCommitsFile || "backupCommits",
      required: true,
    },
  ];
  const { publicAddress, backupCommitsFile } = await prompt.get(promptConfig);
  const backupCommits = JSON.parse(
    fs.readFileSync(backupCommitsFile.toString(), "utf8")
  );
  const provider = ethers.getDefaultProvider(
    ethers.providers.getNetwork(Number(config.network))
  );
  const resultsNeedingPrice = await reveal.encodeWithSaltBackup(
    provider as unknown as ethers.Signer,
    config.network,
    publicAddress.toString(),
    backupCommits,
    config.roundId
  );
  const prices = await prompt.get(
    resultsNeedingPrice.map((result, i: number) => {
      return {
        name: i.toString(),
        required: true,
        description:`Enter committed price, 0 for No, or 1 for Yes for ${reveal.makeKey(result)}`,
      };
    })
  );
  return reveal.etherscanBatchReveal(
    Object.entries(prices).map(([index, price]) => {
      return {
        ...resultsNeedingPrice[Number(index.toString())],
        price: ethers.utils.parseEther(price.toString()).toString(),
      };
    })
  );
};
