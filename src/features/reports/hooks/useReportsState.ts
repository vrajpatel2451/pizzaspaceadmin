import type { TimeRange } from "@/features/dashboard/types/timeRange.types";
import {
  getDefaultTimeRange,
  getPresetById,
} from "@/features/dashboard/constants/timeRangePresets";
import type { ReportType } from "@/types/analytics.types";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  type ComparisonPresetId,
  DEFAULT_COMPARISON_PRESET,
} from "../constants/comparisonPresets";
import { DEFAULT_REPORT_TAB, getReportTabById } from "../constants/reportTabs";

const PARAM_KEYS = {
  TAB: "tab",
  PRESET: "preset",
  START: "start",
  END: "end",
  COMPARE: "compare",
  CSTART: "cstart",
  CEND: "cend",
  STORES: "stores",
  SORT: "sort",
  ORDER: "order",
  LIMIT: "limit",
} as const;

function parseTimeRangeFromParams(searchParams: URLSearchParams): TimeRange {
  const presetId = searchParams.get(PARAM_KEYS.PRESET);
  const startParam = searchParams.get(PARAM_KEYS.START);
  const endParam = searchParams.get(PARAM_KEYS.END);

  if (presetId) {
    const preset = getPresetById(presetId);
    if (preset) {
      return { ...preset.getRange(), presetId: preset.id };
    }
  }

  if (startParam && endParam) {
    const startTime = dayjs(startParam);
    const endTime = dayjs(endParam);
    if (startTime.isValid() && endTime.isValid()) {
      return {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        presetId: undefined,
      };
    }
  }

  return getDefaultTimeRange();
}

export function useReportsState() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse current tab
  const activeTab = useMemo<ReportType>(() => {
    const tabParam = searchParams.get(PARAM_KEYS.TAB) as ReportType | null;
    if (tabParam && getReportTabById(tabParam)) {
      return tabParam;
    }
    return DEFAULT_REPORT_TAB;
  }, [searchParams]);

  // Parse time range
  const timeRange = useMemo<TimeRange>(
    () => parseTimeRangeFromParams(searchParams),
    [searchParams],
  );

  // Parse comparison preset
  const comparisonPresetId = useMemo<ComparisonPresetId>(() => {
    const compareParam = searchParams.get(
      PARAM_KEYS.COMPARE,
    ) as ComparisonPresetId | null;
    if (compareParam) {
      return compareParam;
    }
    return DEFAULT_COMPARISON_PRESET;
  }, [searchParams]);

  // Parse custom comparison dates
  const customCompareStart = searchParams.get(PARAM_KEYS.CSTART) || undefined;
  const customCompareEnd = searchParams.get(PARAM_KEYS.CEND) || undefined;

  // Parse store IDs
  const selectedStoreIds = useMemo<string[]>(() => {
    const storesParam = searchParams.get(PARAM_KEYS.STORES);
    if (storesParam) {
      return storesParam.split(",").filter(Boolean);
    }
    return [];
  }, [searchParams]);

  // Parse sort
  const sortBy = useMemo<string>(() => {
    const sortParam = searchParams.get(PARAM_KEYS.SORT);
    if (sortParam) {
      return sortParam;
    }
    const tab = getReportTabById(activeTab);
    return tab?.defaultSortBy || "revenue";
  }, [searchParams, activeTab]);

  const sortOrder = useMemo<"asc" | "desc">(() => {
    const orderParam = searchParams.get(PARAM_KEYS.ORDER);
    if (orderParam === "asc" || orderParam === "desc") {
      return orderParam;
    }
    return "desc";
  }, [searchParams]);

  // Parse limit
  const limit = useMemo<number>(() => {
    const limitParam = searchParams.get(PARAM_KEYS.LIMIT);
    if (limitParam) {
      const parsed = parseInt(limitParam, 10);
      if (!isNaN(parsed)) {
        return parsed;
      }
    }
    return 10;
  }, [searchParams]);

  // Set default preset on first load if no params
  useEffect(() => {
    if (!searchParams.has(PARAM_KEYS.PRESET) && !searchParams.has(PARAM_KEYS.START)) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set(PARAM_KEYS.PRESET, "today");
      newParams.set(PARAM_KEYS.TAB, DEFAULT_REPORT_TAB);
      newParams.set(PARAM_KEYS.COMPARE, DEFAULT_COMPARISON_PRESET);
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Setters
  const setActiveTab = useCallback(
    (tab: ReportType) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set(PARAM_KEYS.TAB, tab);
      // Reset sort to tab default
      const tabConfig = getReportTabById(tab);
      if (tabConfig) {
        newParams.set(PARAM_KEYS.SORT, tabConfig.defaultSortBy);
        newParams.set(PARAM_KEYS.ORDER, "desc");
      }
      setSearchParams(newParams, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const setTimeRange = useCallback(
    (range: TimeRange) => {
      const newParams = new URLSearchParams(searchParams);

      if (range.presetId) {
        newParams.set(PARAM_KEYS.PRESET, range.presetId);
        newParams.delete(PARAM_KEYS.START);
        newParams.delete(PARAM_KEYS.END);
      } else {
        newParams.delete(PARAM_KEYS.PRESET);
        newParams.set(PARAM_KEYS.START, range.startTime);
        newParams.set(PARAM_KEYS.END, range.endTime);
      }

      setSearchParams(newParams, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const setComparisonPreset = useCallback(
    (presetId: ComparisonPresetId) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set(PARAM_KEYS.COMPARE, presetId);

      // Clear custom dates if not custom preset
      if (presetId !== "custom") {
        newParams.delete(PARAM_KEYS.CSTART);
        newParams.delete(PARAM_KEYS.CEND);
      }

      setSearchParams(newParams, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const setCustomComparisonRange = useCallback(
    (startTime: string, endTime: string) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set(PARAM_KEYS.COMPARE, "custom");
      newParams.set(PARAM_KEYS.CSTART, startTime);
      newParams.set(PARAM_KEYS.CEND, endTime);
      setSearchParams(newParams, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const setSelectedStoreIds = useCallback(
    (storeIds: string[]) => {
      const newParams = new URLSearchParams(searchParams);
      if (storeIds.length > 0) {
        newParams.set(PARAM_KEYS.STORES, storeIds.join(","));
      } else {
        newParams.delete(PARAM_KEYS.STORES);
      }
      setSearchParams(newParams, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const setSortBy = useCallback(
    (field: string) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set(PARAM_KEYS.SORT, field);
      setSearchParams(newParams, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const setSortOrder = useCallback(
    (order: "asc" | "desc") => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set(PARAM_KEYS.ORDER, order);
      setSearchParams(newParams, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const toggleSortOrder = useCallback(() => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  }, [sortOrder, setSortOrder]);

  const setLimit = useCallback(
    (newLimit: number) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set(PARAM_KEYS.LIMIT, String(newLimit));
      setSearchParams(newParams, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  return {
    // State
    activeTab,
    timeRange,
    comparisonPresetId,
    customCompareStart,
    customCompareEnd,
    selectedStoreIds,
    sortBy,
    sortOrder,
    limit,
    // Setters
    setActiveTab,
    setTimeRange,
    setComparisonPreset,
    setCustomComparisonRange,
    setSelectedStoreIds,
    setSortBy,
    setSortOrder,
    toggleSortOrder,
    setLimit,
  };
}
