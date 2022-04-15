import { useState, useEffect } from "react";
import { EncryptedVote } from "common/web3/get/queryEncryptedVotesEvents";
import { PendingRequest } from "common/web3/get/queryGetPendingRequests";
import { DateTime } from "luxon";
import { VoteRevealed } from "common/web3/get/queryVotesRevealedEvents";
import { PostRevealData } from "common/web3/post/revealVotes";
import web3 from "web3";
import { fetchUmip } from "../helpers/fetchUMIP";
import { getPrecisionForIdentifier } from "@uma/common";
import { ethers } from "ethers";
interface TableValue {
  ancillaryData: string;
  identifier: string;
  vote: string;
  revealed: boolean;
  ancHex: string;
  timestamp: string;
  unix: string;
  description?: string;
  idenHex: string;
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
    if (activeRequests.length) {
      let tv: TableValue[] = activeRequests.map((el) => {
        return {
          ancillaryData: el.ancillaryData,
          vote: "-",
          identifier: el.identifier,
          revealed: false,
          ancHex: el.ancHex,
          description: "",
          timestamp: DateTime.fromSeconds(Number(el.time)).toLocaleString({
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hourCycle: "h24",
            timeZoneName: "short",
          }),
          unix: el.time,
          idenHex: el.idenHex,
        };
      });

      if (encryptedVotes.length) {
        const postData = [] as PostRevealData[];
        const latestVotesFirst = [...encryptedVotes].reverse();

        tv = tv.map((el) => {
          const datum = { ...el };
          let vote = "-";
          // I believe latest events are on bottom. requires testing.
          const findVote = latestVotesFirst.find(
            (x) =>
              x.identifier === el.identifier &&
              x.ancillaryData === el.ancHex &&
              x.time === el.unix
          );

          if (findVote) {
            const identifierPrecision = getPrecisionForIdentifier(
              web3.utils.hexToUtf8(el.idenHex)
            );

            datum.vote = ethers.utils.formatUnits(
              findVote.price,
              identifierPrecision
            );

            setHasVoted(true);
            if (el.identifier.includes("Admin")) {
              if (datum.vote === "1" || datum.vote === "1.0")
                datum.vote = "Yes";
              if (datum.vote === "0" || datum.vote === "0.0") datum.vote = "No";
            }
          } else {
            datum.vote = vote;
          }

          const findReveal = revealedVotes.find(
            (x) =>
              x.identifier === el.identifier &&
              x.ancillaryData === el.ancHex &&
              x.time === el.unix
          );

          if (findReveal) {
            datum.revealed = true;
          } else {
            datum.revealed = false;
          }

          // Gather up PostRevealData here to save complexity
          const prd = {} as PostRevealData;
          
          console.log(el.idenHex);

          if (findVote && !findReveal) {
            prd.ancillaryData = el.ancHex;

            prd.time = Number(el.unix);
            prd.identifier = el.idenHex;
            prd.salt = findVote.salt;
            prd.price = findVote.price.toString();
            if (prd.identifier !== "0x5945535f4f525f4e4f5f51554552590000000000000000000000000000000000" && prd.identifier !== "0x5945535f4f525f4e4f5f5155455259") postData.push(prd);
          }
          return datum;
        });

        setPostRevealData(postData);
      }

      // Add description
      const descriptionsAdded = Promise.allSettled(
        tv.map(async (el) => {
          const isUmip = el.identifier.includes("Admin");
          const umipNumber = isUmip
            ? parseInt(el.identifier.split(" ")[1])
            : undefined;

          let description = "Price request.";

          if (umipNumber) {
            try {
              description = (await fetchUmip(umipNumber)).description;
            } catch (err) {
              description = "No data available for this UMIP.";
            }
          }

          return {
            ...el,
            description,
          };
        })
      );

      descriptionsAdded.then((results) => {
        const values = [] as TableValue[];
        results.forEach((result) => {
          if (result.status === "fulfilled") {
            values.push(result.value);
          }
        });

        const sortByLatestUnix = values.sort(
          (a, b) => Number(b.unix) - Number(a.unix)
        );

        setTableValues(sortByLatestUnix);
      });
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
