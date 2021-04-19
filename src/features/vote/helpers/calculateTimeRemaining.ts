// For Timer feature.
export const calculateTimeRemaining = (start: number, end: number) => {
  const difference = end - start;
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
