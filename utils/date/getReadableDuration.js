export default function getReadableDuration(duration) {
  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  let parts = [];
  if (days > 0) {
    let dayText = " day";
    if (days !== 1) {
      dayText += "s";
    }

    parts.push(days + dayText);
  }

  if (hours > 0 || days > 0) {
    let hourText = " hour";

    if (hours !== 1) {
      hourText += "s";
    }
    parts.push(hours + hourText);
  }

  if (days < 1 && minutes > 0) {
    let minuteText = " minute";

    if (minutes !== 1) {
      minuteText += "s";
    }

    parts.push(minutes + minuteText);
  }

  if (days < 1 && hours < 1) {
    let secondText = " second";

    if (seconds !== 1) {
      secondText += "s";
    }

    parts.push(seconds + secondText);
  }

  if (parts.length > 1) {
    parts[parts.length - 1] = "and " + parts[parts.length - 1];
  }

  return parts.join(parts.length > 2 ? ", " : " ");
}
