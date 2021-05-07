import { DateTime } from "luxon";

// For Timer feature.
export const calculateTimeRemaining = () => {
  const utc = DateTime.local().toUTC().endOf("day").toSeconds();
  const difference = utc - DateTime.local().toSeconds();

  let timeLeft = {
    hours: "00",
    minutes: "00",
  };

  if (difference > 0) {
    timeLeft = {
      hours: Math.floor((difference / (60 * 60)) % 24).toString(),
      minutes: Math.floor((difference / 60) % 60).toString(),
    };

    if (Number(timeLeft.hours) < 10) timeLeft.hours = `0${timeLeft.hours}`;
    if (Number(timeLeft.minutes) < 10)
      timeLeft.minutes = `0${timeLeft.minutes}`;
  }

  return timeLeft;
};
