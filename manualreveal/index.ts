import dotenv from "dotenv";
import prompt from "prompt";
import revealWithSalt from "./revealWithSalt";
import revealWithPrivateKey from "./revealWithPrivateKey";
dotenv.config();

// environment variables are completely optional, by default you will be prompted to enter this information or it will be deduced
const {
  network = "1",
  roundId,
  publicAddress,
  privateKey,
  backupCommitsFile,
} = process.env;

async function run() {
  prompt.start();
  const promptConfig = [
    {
      name: "runScript",
      description: `
  Choose a script:
  0. Exit
  1. Reveal With Private Key
  2. Reveal With Salt Backup Commit File`,
      required: true,
      default: 1,
    },
  ];
  const { runScript } = await prompt.get(promptConfig);
  switch (Number(runScript.toString())) {
    case 1:
      return revealWithPrivateKey({
        network,
        publicAddress,
        roundId,
        privateKey,
      });
    case 2:
      return revealWithSalt({
        network,
        publicAddress,
        roundId,
        backupCommitsFile,
      });
    default:
  }
}

run()
  .then((x) => console.log(JSON.stringify(x)))
  .catch((err) => console.error(err.message));
