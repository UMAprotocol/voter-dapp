import { ethers } from "ethers";
import { MAINNET_DEPLOY_BLOCK } from "common/config";
import assert from "assert";

import stringToBytes32 from "common/utils/web3/stringToBytes32";

export interface PriceRound {
  roundId: string;
  identifier: string;
  time: string;
}

export const queryPriceRoundEvents = async (
  contract: ethers.Contract,
  roundId: number | null = null,
  identifier: string | null = null,
  time: number | null = null
) => {
  // Convert identifier from string to Bytes32.
  let bytesIdentifier: Uint8Array | null = null;
  if (identifier) {
    bytesIdentifier = stringToBytes32(identifier);
  }
  // BIG NOTE. You need to pass in null for events with args.
  // Otherwise this will likely return no values.
  // PriceRequestAdded(uint256 indexed roundId, bytes32 indexed identifier, uint256 time)

  const priceRequestFilter = contract.filters.PriceRequestAdded(
    roundId,
    bytesIdentifier,
    time
  );

  try {
    const events = await contract.queryFilter(
      priceRequestFilter,
      MAINNET_DEPLOY_BLOCK
    );

    return events.map((el) => {
      const { args } = el;
      const datum = {} as PriceRound;
      if (args) {
        datum.roundId = args[0].toString();
        datum.identifier = ethers.utils.toUtf8String(args[1]);
        datum.time = args[2].toString();
      }
      return datum;
    });
  } catch (err) {
    console.log("err", err);
  }
};

/*  event VoteCommitted(
  address indexed voter,
  uint256 indexed roundId,
  bytes32 indexed identifier,
  uint256 time,
  bytes ancillaryData
);
*/

export interface VoteEvent {
  address: string;
  roundId: string;
  identifier: string;
  time: string;
}

export const queryVotesCommitted = async (
  contract: ethers.Contract | null,
  address: string | null = null,
  roundId: string | null = null,
  identifier: string | null = null,
  time: number | null = null
) => {
  assert(
    contract,
    "User is not connected to provider and cannot query contract."
  );

  // BIG NOTE. You need to pass in null for events with args.
  // Otherwise this will likely return no values.
  // VoteCommmited: (address,uint256,bytes32,uint256,bytes)
  const filter = contract.filters.VoteCommitted(
    address,
    roundId,
    identifier,
    time,
    null
  );

  try {
    const events = await contract.queryFilter(
      filter,
      !process.env.REACT_APP_CURRENT_ENV ||
        process.env.REACT_APP_CURRENT_ENV === "main"
        ? MAINNET_DEPLOY_BLOCK
        : 1
    );
    return events.map((el) => {
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

export const queryEncryptedVotes = async (
  contract: ethers.Contract | null,
  address: string | null = null,
  roundId: string | null = null,
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
    roundId,
    identifier,
    time,
    null,
    null
  );

  try {
    const events = await contract.queryFilter(filter, MAINNET_DEPLOY_BLOCK);

    return events.map((el) => {
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

export interface VoteRevealed extends VoteEvent {
  price: string;
  numTokens: string;
}

export const queryVoteRevealed = async (
  contract: ethers.Contract | null,
  address: string | null = null,
  roundId: string | null = null,
  identifier: string | null = null,
  time: number | null = null,
  price: number | null = null,
  numTokens: number | null = null
) => {
  assert(
    contract,
    "User is not connected to provider and cannot query contract."
  );

  // BIG NOTE. You need to pass in null for events with args.
  // Otherwise this will likely return no values.
  // VoteRevealed(address,uint256,bytes32,uint256,int256,bytes,uint256)
  const filter = contract.filters.VoteRevealed(
    address,
    roundId,
    identifier,
    time,
    price,
    null,
    numTokens
  );

  try {
    const events = await contract.queryFilter(filter, MAINNET_DEPLOY_BLOCK);

    return events.map((el) => {
      const { args } = el;
      const datum = {} as VoteRevealed;
      if (args) {
        datum.address = args[0];
        datum.roundId = args[1].toString();
        datum.identifier = ethers.utils.toUtf8String(args[2]);
        datum.time = args[3].toString();
        datum.price = ethers.utils.formatEther(args[4]);
        datum.numTokens = args[6].toString();
      }

      return datum;
    });
  } catch (err) {
    console.log("err", err);
  }
};

/*
  event RewardsRetrieved(
    address indexed voter,
    uint256 indexed roundId,
    bytes32 indexed identifier,
    uint256 time,
    bytes ancillaryData,
    uint256 numTokens
  );
*/

export interface RewardsRetrieved extends VoteEvent {
  numTokens: string;
}

export const queryRewardsRetrieved = async (
  contract: ethers.Contract | null,
  address: string | null
) => {
  assert(
    contract,
    "User is not connected to provider and cannot query contract."
  );

  // BIG NOTE. You need to pass in null for events with args.
  // Otherwise this will likely return no values.
  // RewardsRetrieved(address,uint256,bytes32,uint256,bytes,uint256)
  const filter = contract.filters.RewardsRetrieved(
    address,
    null,
    null,
    null,
    null,
    null
  );

  try {
    const events = await contract.queryFilter(filter, MAINNET_DEPLOY_BLOCK);

    return events.map((el) => {
      const { args } = el;
      const datum = {} as RewardsRetrieved;
      if (args) {
        datum.address = args[0];
        datum.roundId = args[1].toString();
        datum.identifier = ethers.utils.toUtf8String(args[2]);
        datum.time = args[3].toString();
        datum.numTokens = args[5].toString();
      }

      return datum;
    });
  } catch (err) {
    console.log("err", err);
  }
};

/*
event PriceResolved(
  uint256 indexed roundId,
  bytes32 indexed identifier,
  uint256 time,
  int256 price,
  bytes ancillaryData
);
*/

export interface PriceResolved {
  roundId: string;
  identifier: string;
  time: string;
  price: string;
}

export const queryPriceResolved = async (contract: ethers.Contract | null) => {
  assert(
    contract,
    "User is not connected to provider and cannot query contract."
  );

  // BIG NOTE. You need to pass in null for events with args.
  // Otherwise this will likely return no values.
  // PriceResolved(uint256,bytes32,uint256,int256,bytes)
  const filter = contract.filters.PriceResolved(null, null, null, null, null);

  try {
    const events = await contract.queryFilter(filter, MAINNET_DEPLOY_BLOCK);

    return events.map((el) => {
      const { args } = el;
      const datum = {} as PriceResolved;
      if (args) {
        datum.roundId = args[0].toString();
        datum.identifier = ethers.utils.toUtf8String(args[1]);
        datum.time = args[2].toString();
        datum.price = ethers.utils.formatEther(args[3]);
      }

      return datum;
    });
  } catch (err) {
    console.log("err", err);
  }
};
