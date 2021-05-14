import { useState, useEffect } from "react";
import { EncryptedVote } from "web3/get/queryEncryptedVotesEvents";
import { PendingRequest } from "web3/get/queryGetPendingRequests";
import { DateTime } from "luxon";
import { VoteRevealed } from "web3/get/queryVotesRevealedEvents";
import { ethers } from "ethers";
import { PostRevealData } from "web3/post/revealVotes";
import web3 from "web3";

interface TableValue {
  ancillaryData: string;
  identifier: string;
  vote: string;
  revealed: boolean;
  ancHex: string;
  timestamp: string;
}

export default function useTableValues(
  activeRequests: PendingRequest[],
  encryptedVotes: EncryptedVote[],
  revealedVotes: VoteRevealed[]
) {
  const [tableValues, setTableValues] = useState<TableValue[]>([]);
  const [postRevealData, setPostRevealData] = useState<PostRevealData[]>([]);
  const [hasVoted, setHasVoted] = useState(false);

  // Take activeRequests and encryptedVotes and convert them into tableViews
  useEffect(() => {
    // Check if the user has voted in this round.
    if (activeRequests.length && !encryptedVotes.length) {
      const tv: TableValue[] = activeRequests.map((el) => {
        return {
          ancillaryData: el.ancillaryData,
          vote: "-",
          identifier: el.identifier,
          revealed: false,
          ancHex: el.idenHex,
          timestamp: DateTime.fromSeconds(Number(el.time)).toLocaleString({
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h24",
            timeZoneName: "short",
          }),
        };
      });

      setTableValues(tv);
    }
    if (activeRequests.length && encryptedVotes.length) {
      const tv = [] as TableValue[];
      const postData = [] as PostRevealData[];
      const latestVotesFirst = [...encryptedVotes].reverse();

      activeRequests.forEach((el) => {
        const datum = {} as TableValue;
        datum.ancillaryData = el.ancillaryData;
        datum.identifier = el.identifier;
        let vote = "-";
        // I believe latest events are on bottom. requires testing.
        const findVote = latestVotesFirst.find(
          (x) =>
            x.identifier === el.identifier &&
            x.ancillaryData === el.ancHex &&
            x.time === el.time
        );

        if (findVote) {
          datum.vote = ethers.utils.formatEther(findVote.price);
          setHasVoted(true);
          if (el.identifier.includes("Admin")) {
            if (datum.vote === "1" || datum.vote === "1.0") datum.vote = "Yes";
            if (datum.vote === "0" || datum.vote === "0.0") datum.vote = "No";
          }
        } else {
          datum.vote = vote;
        }

        const findReveal = revealedVotes.find(
          (x) =>
            x.identifier === el.identifier &&
            x.ancillaryData === el.ancHex &&
            x.time === el.time
        );

        if (findReveal) {
          datum.revealed = true;
        } else {
          datum.revealed = false;
        }

        datum.timestamp = DateTime.fromSeconds(Number(el.time)).toLocaleString({
          month: "short",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h24",
          timeZoneName: "short",
        });

        tv.push(datum);
        // Gather up PostRevealData here to save complexity
        const prd = {} as PostRevealData;

        if (findVote && !findReveal) {
          prd.ancillaryData = el.ancillaryData;
          // anc data is set to - or N/A in UI if empty, convert back to 0x.
          if (
            el.ancillaryData === UNDEFINED_VOTE ||
            el.ancillaryData === "N/A"
          ) {
            prd.ancillaryData = "0x";
          } else {
            prd.ancillaryData = web3.utils.utf8ToHex(el.ancillaryData);
          }
          prd.time = Number(el.time);
          prd.identifier = el.idenHex;
          prd.salt = findVote.salt;
          // datum.price = toWeiSafe(findVote.price).toString();
          prd.price = findVote.price.toString();
          postData.push(prd);
        }
      });
      setTableValues(tv);
      setPostRevealData(postData);
    }
  }, [activeRequests, encryptedVotes, revealedVotes]);

  return {
    tableValues,
    setTableValues,
    postRevealData,
    setPostRevealData,
    hasVoted,
  };
}

const UNDEFINED_VOTE = "-";
