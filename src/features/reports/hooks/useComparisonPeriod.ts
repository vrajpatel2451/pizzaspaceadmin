import type { TimeRange } from "@/features/dashboard/types/timeRange.types";
import { useMemo } from "react";
import {
  type ComparisonPresetId,
  getComparisonPresetById,
} from "../constants/comparisonPresets";

interface ComparisonPeriod {
  startTime: string;
  endTime: string;
}

interface UseComparisonPeriodOptions {
  currentRange: TimeRange;
  comparisonPresetId: ComparisonPresetId;
  customCompareStart?: string;
  customCompareEnd?: string;
}

export function useComparisonPeriod({
  currentRange,
  comparisonPresetId,
  customCompareStart,
  customCompareEnd,
}: UseComparisonPeriodOptions): ComparisonPeriod {
  return useMemo(() => {
    // If custom preset with custom dates provided, use those
    if (
      comparisonPresetId === "custom" &&
      customCompareStart &&
      customCompareEnd
    ) {
      return {
        startTime: customCompareStart,
        endTime: customCompareEnd,
      };
    }

    // Otherwise, calculate from preset
    const preset = getComparisonPresetById(comparisonPresetId);
    if (preset) {
      return preset.getComparisonRange(currentRange);
    }

    // Fallback to previous period
    const defaultPreset = getComparisonPresetById("previous_period");
    return defaultPreset!.getComparisonRange(currentRange);
  }, [currentRange, comparisonPresetId, customCompareStart, customCompareEnd]);
}
