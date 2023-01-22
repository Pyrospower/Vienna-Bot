export interface Time {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

// Convertit le temps en millisecondes
export function timeToMilliseconds(time: Time) {
  const { days = 0, hours = 0, minutes = 0, seconds = 0 } = time;

  const timeInMilliseconds = {
    daysInMilliseconds: days * 24 * 60 * 60 * 1000,
    hoursInMilliseconds: hours * 60 * 60 * 1000,
    minutesInMilliseconds: minutes * 60 * 1000,
    secondsInMilliseconds: seconds * 1000,
  };

  return Object.values(timeInMilliseconds).reduce((a, b) => a + b);
}

// Crée une phrase avec le temps
export function timeToString(time: Time) {
  const { days = 0, hours = 0, minutes = 0, seconds = 0 } = time;

  const daysTxt = days > 0 ? `${days} jour${days > 1 ? "s" : ""} ` : "";
  const hoursTxt = hours > 0 ? `${hours} heure${hours > 1 ? "s" : ""} ` : "";
  // prettier-ignore
  const minutesTxt = minutes > 0 ? `${minutes} minute${minutes > 1 ? "s" : ""} ` : "";
  const secondsTxt = seconds > 0 ? `${seconds} seconde${seconds > 1 ? "s" : ""}` : "";

  const sentence = `${daysTxt}${hoursTxt}${minutesTxt}${secondsTxt}`;

  return sentence;
}
