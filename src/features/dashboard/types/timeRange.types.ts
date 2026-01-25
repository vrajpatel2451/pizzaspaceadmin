export type TimeRangePresetGroup = "recent" | "days" | "weeks_months";

export type TimeRangePreset = {
  id: string;
  label: string;
  group: TimeRangePresetGroup;
  getRange: () => { startTime: string; endTime: string };
};

export type TimeRange = {
  startTime: string; // ISO string
  endTime: string; // ISO string
  presetId?: string; // If using a preset
};

export type CustomTimeRange = {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  startHour: number; // 0-23
  startMinute: number; // 0-59
  endHour: number; // 0-23
  endMinute: number; // 0-59
};

export type PresetGroup = {
  key: TimeRangePresetGroup;
  label: string;
};
