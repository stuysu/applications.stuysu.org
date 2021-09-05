import moment from "moment-timezone";

export default function getReadableDate(rawDate, now) {
  // Create a date object in case not already
  const date = new Date(rawDate);

  const momentDate = moment(date).tz(
    globalThis.Intl?.DateTimeFormat().resolvedOptions().timeZone
  );

  const millisecondsFromNow = date.getTime() - now.getTime();
  const inPast = millisecondsFromNow < 0;

  const hoursFromNow = Math.abs(momentDate.diff(now, "hours"));
  // Round 0 minutes to 1 minute
  const minutesFromNow = Math.abs(momentDate.diff(now, "minutes"));

  const standardFormatting = momentDate.format("MMMM Do [at] h:mma (z)");

  if (minutesFromNow < 60) {
    if (minutesFromNow === 0) {
      return "now, " + standardFormatting;
    }

    const pluralityPhrasing =
      minutesFromNow > 1 ? minutesFromNow + " minutes" : "a minute";

    const tensePhrasing = inPast
      ? `${pluralityPhrasing} ago`
      : `in ${pluralityPhrasing}`;
    return `${tensePhrasing}, on ${standardFormatting}`;
  }

  if (hoursFromNow < 12) {
    if (hoursFromNow === 1) {
      const tensePhrasing = inPast ? "about an hour ago" : "in about an hour";
      return `${tensePhrasing}, on ${standardFormatting}`;
    }

    const tensePhrasing = inPast
      ? `about ${hoursFromNow} hours ago`
      : `in about ${hoursFromNow} hours`;
    return `${tensePhrasing}, on ${standardFormatting}`;
  }

  return momentDate.calendar(null, {
    sameDay: "[today], MMMM Do [at] h:mma (z)",
    nextDay: "[tomorrow], MMMM Do [at] h:mma (z)",
    nextWeek: "[next] dddd, MMMM Do [at] h:mma (z)",
    lastDay: "[yesterday], MMMM Do [at] h:mma (z)",
    lastWeek: "[last] dddd, MMMM Do [at] h:mma (z)",
    sameElse: "MMMM Do, YYYY [at] h:mma (z)",
  });
}
