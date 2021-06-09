import { useState, useEffect } from "react";
import { PriceRequestAdded } from "web3/get/queryPriceRequestAddedEvents";
import { DateTime } from "luxon";
import { fetchUmip } from "./fetchUMIP";
import { FormattedRequest } from "./UpcomingRequests";

export default function useUpcomingRequests(
  upcomingRequests: PriceRequestAdded[]
) {
  const [tableValues, setTableValues] = useState<FormattedRequest[]>([]);

  // Take activeRequests and encryptedVotes and convert them into tableViews
  useEffect(() => {
    // Check if the user has voted in this round.
    if (upcomingRequests.length) {
      const values = upcomingRequests.map((el) => {
        const datum = {} as FormattedRequest;
        datum.proposal = el.identifier;
        datum.description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        `;
        datum.timestamp = DateTime.fromSeconds(Number(el.time)).toLocaleString({
          month: "short",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hourCycle: "h24",
          timeZoneName: "short",
        });
        datum.unix = el.time;

        return datum;
      });

      // Add description
      const descriptionsAdded = Promise.allSettled(
        values.map(async (el) => {
          const isUmip = el.proposal.includes("Admin");
          const umipNumber = isUmip
            ? parseInt(el.proposal.split(" ")[1])
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
        const vals = [] as FormattedRequest[];
        results.forEach((result) => {
          if (result.status === "fulfilled") {
            vals.push(result.value);
          }
        });

        const sortByLatestUnix = vals.sort(
          (a, b) => Number(b.unix) - Number(a.unix)
        );
        return setTableValues(sortByLatestUnix);
      });
    } else {
      setTableValues([]);
    }
  }, [upcomingRequests]);

  return {
    tableValues,
    setTableValues,
  };
}
