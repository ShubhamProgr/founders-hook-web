export function timeAgo(date: string | Date): string {
  const then = new Date(date).getTime();
  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000));

  const units: [number, string][] = [
    [60, "s"],
    [60, "m"],
    [24, "h"],
    [7, "d"],
    [4.345, "w"],
    [12, "mo"],
    [Infinity, "y"],
  ];

  let value = seconds;
  let unit = "s";
  for (const [size, label] of units) {
    if (value < size) {
      unit = label;
      break;
    }
    value = Math.floor(value / size);
    unit = label;
  }

  if (seconds < 60) return "just now";
  return `${value}${unit} ago`;
}
