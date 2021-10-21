# Manual Reveal Script

This is a tool for [UMA Voting Dapp](vote.umaproject.org), when you are unable to reveal through the website for some reason.
This script allows you to input backed up values and provides you with an output string to allow a manual reveal through etherscan for a non 2-key voter.

## Quick Start

In order to run, you must clone the voter dapp:

`git clone https://github.com/UMAprotocol/voter-dapp.git`

Then you must install dependencies inside the `voter-dapp` folder.

`cd voter-dapp && yarn`

Finally run the manual reveal script:

`yarn reveal`

This will prompt you to select a script to run.

## Revealing with your private key

The easiest way to reveal is using the login signature from the [Voter Dapp](vote.umaproject.org).

Once you run the script, select 1 to reveal with private key.

You can your private key signature first signing into the app, then visiting your browsers dev tools.
The application tab -> local storage -> `https://vote.umaproject.org`. Once here you should see a field for `signingKeys`.
Click the signing keys and copy the `privateKey` hex string. You will need to paste this into the script when prompted.

Follow the prompts to produce the reveal string. Save the output for a manual reveal in etherscan.

## Revealing with backup commits

This requires you add a file called `backupCommits` with an object copied from your local storage in the Voter Dapp.
You will also need to know the values you committed for each vote. When running the script, select 2 to try this method.

In order to find the backup commits object first open your browsers dev tools.
In the application tab -> local storage -> `https://vote.umaproject.org`. Once here you should see a field for `backupCommits`.
Click the backupCommits field, and then right click and copy the entire object. Paste this into a file inside the voter-dapp folder
called `backupCommits`.

Follow the prompts to produce the reveal string. Save the output for a manual reveal in etherscan.

## Manually Revealing on Etherscan

To reveal on ethereum mainnet, visit this link to [UMAs Voting Contract](https://etherscan.io/address/0x8b1631ab830d11531ae83725fda4d86012eccd77#writeContract).
Make sure you are in the `Contract-> Write Contract` tab. Connect your Metamask wallet where it says `Connect to Web3`.
Once connected, find the `batchReveal` function. There may be 2 of them, paste the output of the scripts into the second one.
Press the `Write` button and send the transaction through Metamask.

## Verify Reveal

After a few minutes, the Voter Dapp should update with revealed statuses for your votes if everything worked correctly.
