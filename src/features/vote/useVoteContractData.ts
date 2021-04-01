import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { MAINNET_DEPLOY_BLOCK } from "common/config";

// This can be accessed without logging the user in.
export default function useVoteContractData(
  contract: ethers.Contract | null,
  address: string | null
) {
  const [votesCommitted, setVotesCommitted] = useState<VoteCommitted[]>([]);
  useEffect(() => {
    if (contract && address) {
      queryVotesCommitted(contract, address).then((data) => {
        if (data) setVotesCommitted(data);
      });
    }
  }, [contract, address]);

  return { votesCommitted };
}

/*  event VoteCommitted(
  address indexed voter,
  uint256 indexed roundId,
  bytes32 indexed identifier,
  uint256 time,
  bytes ancillaryData
);
*/

interface VoteCommitted {
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
    const filteredEvents = events.filter(
      (el) => el.args && el.args[0].toLowerCase() === address.toLowerCase()
    );

    return filteredEvents.map((el, index) => {
      const { args } = el;
      const datum = {} as VoteCommitted;
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
