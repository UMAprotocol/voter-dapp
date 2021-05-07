import { DateTime } from "luxon";

// For Timer feature.
export const calculateTimeRemaining = () => {
  // Previous start of commit -- May 6th, 1700 hours, PST
  const PREVIOUS_START_TIME = 1620345840;
  const dt = DateTime.fromSeconds(PREVIOUS_START_TIME);

  const daysCalc = DateTime.local().diff(dt, "days").toObject().days;
  let ceiling = 0;
  if (daysCalc) ceiling = Math.ceil(daysCalc);

  const eoc = dt.plus({ days: ceiling }).toSeconds();

  const difference = eoc - DateTime.local().toSeconds();
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
