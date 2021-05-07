import { ethers } from "ethers";
import { VoteEvent } from "../types.web3";
import assert from "assert";
import { VOTER_CONTRACT_BLOCK } from "common/config";
import { decryptMessage } from "common/tempUmaFunctions";

/*
  event EncryptedVote(
    address indexed voter,
    uint256 indexed roundId,
    bytes32 indexed identifier,
    uint256 time,
    bytes ancillaryData,
    bytes encryptedVote
  );

*/

export interface EncryptedVote extends VoteEvent {
  price: string;
  salt: string;
  idenHex: string;
}

export const queryEncryptedVotes = async (
  contract: ethers.Contract | null,
  privateKey: string,
  address: string | null = null,
  roundId: string | null,
  identifier: string | null = null,
  time: number | null = null
) => {
  assert(
    contract,
    "User is not connected to provider and cannot query contract."
  );

  // BIG NOTE. You need to pass in null for events with args.
  // Otherwise this will likely return no values.
  // EncryptedVote: (address,uint256,bytes32,uint256,bytes,bytes)
  const filter = contract.filters.EncryptedVote(
    address,
    roundId ? Number(roundId) : null,
    identifier,
    time,
    null,
    null
  );

  try {
    const events = await contract.queryFilter(filter, VOTER_CONTRACT_BLOCK);
    // there may be multiple commit events, if there are collisions, then take newest
    const eventTable = events.reduce(
      (result: { [key: string]: any }, event: any) => {
        const { args } = event;
        const key = [
          args.identifier,
          args.ancillaryData,
          args.roundId.toString(),
          args.time.toString(),
        ].join("!");
        // if multiple commit events, always take the newest one
        if (result[key]) {
          if (result[key].blockNumber < event.blockNumber) result[key] = event;
        } else {
          result[key] = event;
        }
        return result;
      },
      {}
    );

    const decryptedEvents = await Promise.all(
      Object.values(eventTable).map(async (el) => {
        const { args } = el;
        const datum = {} as EncryptedVote;
        if (args) {
          let price = "";
          let salt = "";
          const json = JSON.parse(await decryptMessage(privateKey, args[5]));
          price = json.price;
          salt = json.salt;
          datum.address = args[0];
          datum.roundId = args[1].toString();
          datum.identifier = ethers.utils.toUtf8String(args[2]);
          datum.time = args[3].toString();
          datum.ancillaryData = args[4];
          datum.price = price;
          datum.salt = salt;
          datum.idenHex = args[2];
        }
        return datum;
      })
    );
    return decryptedEvents;
  } catch (err) {
    console.log("err", err);
  }
};
