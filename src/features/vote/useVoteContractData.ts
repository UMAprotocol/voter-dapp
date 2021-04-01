import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { MAINNET_DEPLOY_BLOCK } from "common/config";

// This can be accessed without logging the user in.
export default function useVoteContractData(
  contract: ethers.Contract | null,
  address: string | null
) {
  const [votesCommitted, setVotesCommitted] = useState<VoteEvent[]>([]);
  const [encryptedVotes, setEncryptedVotes] = useState<VoteEvent[]>([]);
  const [votesRevealed, setVotesRevealed] = useState<VoteRevealed[]>([]);

  useEffect(() => {
    if (contract && address) {
      console.log("cntract", contract);
      queryVotesCommitted(contract, address).then((data) => {
        if (data) setVotesCommitted(data);
      });
      queryEncryptedVotes(contract, address).then((data) => {
        if (data) setEncryptedVotes(data);
      });
      queryVoteRevealed(contract, address).then((data) => {
        console.log("revealed data", data);
        if (data) setVotesRevealed(data);
      });
    }
  }, [contract, address]);

  return { votesCommitted, encryptedVotes, votesRevealed };
}

/*  event VoteCommitted(
  address indexed voter,
  uint256 indexed roundId,
  bytes32 indexed identifier,
  uint256 time,
  bytes ancillaryData
);
*/

interface VoteEvent {
  address: string;
  roundId: string;
  identifier: string;
  time: string;
}

const queryVotesCommitted = async (
  contract: ethers.Contract,
  address: string
) => {
  // BIG NOTE. You need to pass in null for events with args.
  // Otherwise this will likely return no values.
  // VoteCommmited: (address,uint256,bytes32,uint256,bytes)
  const filter = contract.filters.VoteCommitted(null, null, null, null, null);
  try {
    const events = await contract.queryFilter(filter, MAINNET_DEPLOY_BLOCK);
    const filteredEventsByAddress = events.filter(
      (el) => el.args && el.args[0].toLowerCase() === address.toLowerCase()
    );

    return filteredEventsByAddress.map((el) => {
      const { args } = el;
      const datum = {} as VoteEvent;
      if (args) {
        datum.address = args[0];
        datum.roundId = args[1].toString();
        datum.identifier = ethers.utils.toUtf8String(args[2]);
        datum.time = args[3].toString();
      }

      return datum;
    });
  } catch (err) {
    console.log("err", err);
  }
};
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

const queryEncryptedVotes = async (
  contract: ethers.Contract,
  address: string
) => {
  // BIG NOTE. You need to pass in null for events with args.
  // Otherwise this will likely return no values.
  // EncryptedVote: (address,uint256,bytes32,uint256,bytes,bytes)
  const filter = contract.filters.EncryptedVote(
    null,
    null,
    null,
    null,
    null,
    null
  );
  try {
    const events = await contract.queryFilter(filter, MAINNET_DEPLOY_BLOCK);
    const filteredEventsByAddress = events.filter(
      (el) => el.args && el.args[0].toLowerCase() === address.toLowerCase()
    );

    return filteredEventsByAddress.map((el) => {
      const { args } = el;
      const datum = {} as VoteEvent;
      if (args) {
        datum.address = args[0];
        datum.roundId = args[1].toString();
        datum.identifier = ethers.utils.toUtf8String(args[2]);
        datum.time = args[3].toString();
      }

      return datum;
    });
  } catch (err) {
    console.log("err", err);
  }
};

/*
  event VoteRevealed(
    address indexed voter,
    uint256 indexed roundId,
    bytes32 indexed identifier,
    uint256 time,
    int256 price,
    bytes ancillaryData,
    uint256 numTokens
  );
*/

interface VoteRevealed extends VoteEvent {
  price: string;
  numTokens: string;
}

const queryVoteRevealed = async (
  contract: ethers.Contract,
  address: string
) => {
  // BIG NOTE. You need to pass in null for events with args.
  // Otherwise this will likely return no values.
  // VoteRevealed(address,uint256,bytes32,uint256,int256,bytes,uint256)
  const filter = contract.filters.VoteRevealed(
    null,
    null,
    null,
    null,
    null,
    null,
    null
  );
  try {
    const events = await contract.queryFilter(filter, MAINNET_DEPLOY_BLOCK);
    const filteredEventsByAddress = events.filter(
      (el) => el.args && el.args[0].toLowerCase() === address.toLowerCase()
    );

    return filteredEventsByAddress.map((el) => {
      const { args } = el;
      const datum = {} as VoteRevealed;
      if (args) {
        datum.address = args[0];
        datum.roundId = args[1].toString();
        datum.identifier = ethers.utils.toUtf8String(args[2]);
        datum.time = args[3].toString();
        datum.price = args[4].toString();
        datum.numTokens = args[6].toString();
      }

      return datum;
    });
  } catch (err) {
    console.log("err", err);
  }
};
