import { DateTime, Duration } from "luxon";

// For Timer feature.
export const calculateTimeRemaining = () => {
  const utc = DateTime.local().toUTC().endOf("day").toMillis();
  const difference = utc - DateTime.local().toMillis();

  let text = "00:00";
  // format difference
  if (difference > 0) text = Duration.fromMillis(difference).toFormat("hh:mm");
  // add h and m to time.
  const split = text.split(":");
  const ls = `${split[0]}h`;
  const rs = `${split[1]}m`;

  text = `${ls}:${rs}`;

  return text;
};
