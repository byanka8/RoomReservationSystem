export function formatDatePretty(dateString?: string | null) {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  if (Number.isNaN(date.valueOf())) {
    return dateString;
  }

  return date.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatTimePretty(timeString?: string | null) {
  if (!timeString) return "N/A";

  const [hourString, minuteString] = timeString.split(":");
  const hour = Number(hourString);
  const minute = Number(minuteString);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return timeString;
  }

  const date = new Date();
  date.setHours(hour, minute, 0, 0);

  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}
