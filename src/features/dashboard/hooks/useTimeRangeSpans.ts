import dayjs from "dayjs";
import { useMemo } from "react";
import type { TimeRange } from "../types/timeRange.types";

/**
 * Calculates the optimal number of spans (time intervals) for chart data
 * based on the duration of the selected time range.
 *
 * Strategy:
 * - < 2 hours: 10-minute intervals (max 12 spans)
 * - 2-24 hours: hourly intervals
 * - 1-7 days: 6-hour intervals (max 28 spans)
 * - > 7 days: daily intervals (max 90 spans)
 */
export function calculateSpans(timeRange: TimeRange): number {
  const start = dayjs(timeRange.startTime);
  const end = dayjs(timeRange.endTime);
  const diffMinutes = end.diff(start, "minute");
  const diffHours = end.diff(start, "hour");
  const diffDays = end.diff(start, "day");

  // < 2 hours: 10-minute intervals
  if (diffMinutes <= 120) {
    return Math.max(Math.min(Math.ceil(diffMinutes / 10), 12), 1);
  }

  // 2-24 hours: hourly intervals
  if (diffHours <= 24) {
    return Math.max(diffHours, 1);
  }

  // 1-7 days: 6-hour intervals (max 28)
  if (diffDays <= 7) {
    return Math.min(Math.max(diffDays * 4, 1), 28);
  }

  // > 7 days: daily intervals (max 90)
  return Math.min(Math.max(diffDays, 1), 90);
}

/**
 * Hook that returns the optimal spans count for a given time range.
 * Memoized to prevent unnecessary recalculations.
 */
export function useTimeRangeSpans(timeRange: TimeRange): number {
  return useMemo(() => calculateSpans(timeRange), [timeRange]);
}
