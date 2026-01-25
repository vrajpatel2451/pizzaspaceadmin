import type { TimeRange } from "@/features/dashboard/types/timeRange.types";
import dayjs from "dayjs";

export type ComparisonPresetId =
  | "previous_period"
  | "same_last_week"
  | "same_last_month"
  | "same_last_year"
  | "custom";

export interface ComparisonPreset {
  id: ComparisonPresetId;
  label: string;
  getComparisonRange: (currentRange: TimeRange) => {
    startTime: string;
    endTime: string;
  };
}

export const COMPARISON_PRESETS: ComparisonPreset[] = [
  {
    id: "previous_period",
    label: "Previous Period",
    getComparisonRange: (currentRange) => {
      const start = dayjs(currentRange.startTime);
      const end = dayjs(currentRange.endTime);
      const duration = end.diff(start);

      return {
        startTime: start.subtract(duration, "millisecond").toISOString(),
        endTime: start.toISOString(),
      };
    },
  },
  {
    id: "same_last_week",
    label: "Same Day Last Week",
    getComparisonRange: (currentRange) => {
      const start = dayjs(currentRange.startTime);
      const end = dayjs(currentRange.endTime);

      return {
        startTime: start.subtract(1, "week").toISOString(),
        endTime: end.subtract(1, "week").toISOString(),
      };
    },
  },
  {
    id: "same_last_month",
    label: "Same Period Last Month",
    getComparisonRange: (currentRange) => {
      const start = dayjs(currentRange.startTime);
      const end = dayjs(currentRange.endTime);

      return {
        startTime: start.subtract(1, "month").toISOString(),
        endTime: end.subtract(1, "month").toISOString(),
      };
    },
  },
  {
    id: "same_last_year",
    label: "Same Period Last Year",
    getComparisonRange: (currentRange) => {
      const start = dayjs(currentRange.startTime);
      const end = dayjs(currentRange.endTime);

      return {
        startTime: start.subtract(1, "year").toISOString(),
        endTime: end.subtract(1, "year").toISOString(),
      };
    },
  },
  {
    id: "custom",
    label: "Custom Range",
    getComparisonRange: () => {
      // Custom range will be provided manually
      return {
        startTime: dayjs().subtract(1, "day").startOf("day").toISOString(),
        endTime: dayjs().subtract(1, "day").endOf("day").toISOString(),
      };
    },
  },
];

export const getComparisonPresetById = (
  id: ComparisonPresetId,
): ComparisonPreset | undefined => {
  return COMPARISON_PRESETS.find((preset) => preset.id === id);
};

export const DEFAULT_COMPARISON_PRESET: ComparisonPresetId = "previous_period";
