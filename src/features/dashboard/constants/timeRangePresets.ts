import dayjs from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import type {
  PresetGroup,
  TimeRangePreset,
  TimeRangePresetGroup,
} from "../types/timeRange.types";

dayjs.extend(quarterOfYear);

export const TIME_RANGE_PRESETS: TimeRangePreset[] = [
  // Recent
  {
    id: "last_1_hour",
    label: "Last 1 hour",
    group: "recent",
    getRange: () => ({
      startTime: dayjs().subtract(1, "hour").toISOString(),
      endTime: dayjs().toISOString(),
    }),
  },
  {
    id: "last_6_hours",
    label: "Last 6 hours",
    group: "recent",
    getRange: () => ({
      startTime: dayjs().subtract(6, "hour").toISOString(),
      endTime: dayjs().toISOString(),
    }),
  },
  {
    id: "last_24_hours",
    label: "Last 24 hours",
    group: "recent",
    getRange: () => ({
      startTime: dayjs().subtract(24, "hour").toISOString(),
      endTime: dayjs().toISOString(),
    }),
  },

  // Days
  {
    id: "today",
    label: "Today",
    group: "days",
    getRange: () => ({
      startTime: dayjs().startOf("day").toISOString(),
      endTime: dayjs().toISOString(),
    }),
  },
  {
    id: "yesterday",
    label: "Yesterday",
    group: "days",
    getRange: () => ({
      startTime: dayjs().subtract(1, "day").startOf("day").toISOString(),
      endTime: dayjs().subtract(1, "day").endOf("day").toISOString(),
    }),
  },
  {
    id: "last_7_days",
    label: "Last 7 days",
    group: "days",
    getRange: () => ({
      startTime: dayjs().subtract(7, "day").startOf("day").toISOString(),
      endTime: dayjs().toISOString(),
    }),
  },

  // Weeks & Months
  {
    id: "this_week",
    label: "This week",
    group: "weeks_months",
    getRange: () => ({
      startTime: dayjs().startOf("week").toISOString(),
      endTime: dayjs().toISOString(),
    }),
  },
  {
    id: "last_week",
    label: "Last week",
    group: "weeks_months",
    getRange: () => ({
      startTime: dayjs().subtract(1, "week").startOf("week").toISOString(),
      endTime: dayjs().subtract(1, "week").endOf("week").toISOString(),
    }),
  },
  {
    id: "this_month",
    label: "This month",
    group: "weeks_months",
    getRange: () => ({
      startTime: dayjs().startOf("month").toISOString(),
      endTime: dayjs().toISOString(),
    }),
  },
  {
    id: "last_month",
    label: "Last month",
    group: "weeks_months",
    getRange: () => ({
      startTime: dayjs().subtract(1, "month").startOf("month").toISOString(),
      endTime: dayjs().subtract(1, "month").endOf("month").toISOString(),
    }),
  },
  {
    id: "this_quarter",
    label: "This quarter",
    group: "weeks_months",
    getRange: () => ({
      startTime: dayjs().startOf("quarter").toISOString(),
      endTime: dayjs().toISOString(),
    }),
  },
];

export const PRESET_GROUPS: PresetGroup[] = [
  { key: "recent", label: "Recent" },
  { key: "days", label: "Days" },
  { key: "weeks_months", label: "Weeks & Months" },
];

export function getPresetById(id: string): TimeRangePreset | undefined {
  return TIME_RANGE_PRESETS.find((preset) => preset.id === id);
}

export function getPresetsByGroup(
  group: TimeRangePresetGroup,
): TimeRangePreset[] {
  return TIME_RANGE_PRESETS.filter((preset) => preset.group === group);
}

export function getDefaultTimeRange() {
  const todayPreset = getPresetById("today");
  if (todayPreset) {
    return {
      ...todayPreset.getRange(),
      presetId: todayPreset.id,
    };
  }
  // Fallback
  return {
    startTime: dayjs().startOf("day").toISOString(),
    endTime: dayjs().toISOString(),
    presetId: "today",
  };
}
