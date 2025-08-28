import dayjs from "dayjs";

type FormatOptions = {
  showDate?: boolean;
  showDay?: boolean;
  showTime?: boolean;
  fallback?: string;
};

export const prettyDate = (
  date: Date | string | null | undefined,
  options: FormatOptions = {},
): string => {
  const {
    showDate = true,
    showDay = true,
    showTime = true,
    fallback = "Invalid Date",
  } = options;

  if (!date) return fallback;

  const parsed = dayjs(date);
  if (!parsed.isValid()) return fallback;

  const parts: string[] = [];

  if (showDate) {
    parts.push("DD MMM YY");
  }

  if (showDay) {
    parts.push("(ddd)");
  }

  const datePart = parts.join(" ");

  if (showTime) {
    const timePart = parsed.format("hh:mm A");
    return `${parsed.format(datePart)} - ${timePart}`.toUpperCase();
  }

  return parsed.format(datePart).toUpperCase();
};
