import { DateTime, Duration } from "luxon";

// For Timer feature.
export const calculateTimeRemaining = () => {
  const utc = DateTime.local().toUTC().endOf("day").toMillis();
  const difference = utc - DateTime.local().toMillis();

  // format difference
  const text = Duration.fromMillis(difference).toFormat("hh:mm");

  return text;
};
