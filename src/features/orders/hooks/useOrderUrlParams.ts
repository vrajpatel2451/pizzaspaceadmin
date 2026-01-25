import {
  getDefaultTimeRange,
  getPresetById,
} from "@/features/dashboard/constants/timeRangePresets";
import type { TimeRange } from "@/features/dashboard/types/timeRange.types";
import type { OrderStatus } from "@/types/order.types";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

// URL param keys
const PARAM_KEYS = {
  PRESET: "preset",
  START: "start",
  END: "end",
  STORE: "store",
  STATUS: "status",
  CUSTOMER: "customer",
  SEARCH: "search",
  PAGE: "page",
} as const;

interface UseOrderUrlParamsOptions {
  defaultStatus?: OrderStatus;
  defaultPreset?: string;
}

interface UseOrderUrlParamsReturn {
  // Time range
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;

  // Filters
  storeId: string;
  setStoreId: (id: string) => void;
  status: OrderStatus | undefined;
  setStatus: (status: OrderStatus | undefined) => void;
  customerId: string;
  setCustomerId: (id: string) => void;
  search: string;
  setSearch: (search: string) => void;
  page: number;
  setPage: (page: number) => void;

  // Reset
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

function parseTimeRangeFromParams(
  searchParams: URLSearchParams,
  defaultPreset?: string,
): TimeRange {
  const presetId = searchParams.get(PARAM_KEYS.PRESET);
  const startParam = searchParams.get(PARAM_KEYS.START);
  const endParam = searchParams.get(PARAM_KEYS.END);

  // If preset is specified, use it
  if (presetId) {
    const preset = getPresetById(presetId);
    if (preset) {
      return {
        ...preset.getRange(),
        presetId: preset.id,
      };
    }
  }

  // If custom start/end specified
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

  // Use default preset or today
  if (defaultPreset) {
    const preset = getPresetById(defaultPreset);
    if (preset) {
      return {
        ...preset.getRange(),
        presetId: preset.id,
      };
    }
  }

  return getDefaultTimeRange();
}

export function useOrderUrlParams(
  options: UseOrderUrlParamsOptions = {},
): UseOrderUrlParamsReturn {
  const { defaultStatus, defaultPreset = "today" } = options;
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse state from URL
  const timeRange = useMemo(
    () => parseTimeRangeFromParams(searchParams, defaultPreset),
    [searchParams, defaultPreset],
  );

  const storeId = searchParams.get(PARAM_KEYS.STORE) || "";
  const customerId = searchParams.get(PARAM_KEYS.CUSTOMER) || "";
  const search = searchParams.get(PARAM_KEYS.SEARCH) || "";
  const page = parseInt(searchParams.get(PARAM_KEYS.PAGE) || "1", 10);

  const status = useMemo(() => {
    const statusParam = searchParams.get(PARAM_KEYS.STATUS);
    if (statusParam) return statusParam as OrderStatus;
    return defaultStatus;
  }, [searchParams, defaultStatus]);

  // Set default params if none exist
  useEffect(() => {
    const hasTimeParam =
      searchParams.has(PARAM_KEYS.PRESET) ||
      searchParams.has(PARAM_KEYS.START) ||
      searchParams.has(PARAM_KEYS.END);

    if (!hasTimeParam) {
      setSearchParams(
        (prev) => {
          prev.set(PARAM_KEYS.PRESET, defaultPreset);
          if (defaultStatus) {
            prev.set(PARAM_KEYS.STATUS, defaultStatus);
          }
          return prev;
        },
        { replace: true },
      );
    }
  }, []);

  // Update URL when time range changes
  const setTimeRange = useCallback(
    (range: TimeRange) => {
      setSearchParams(
        (prev) => {
          prev.delete(PARAM_KEYS.PRESET);
          prev.delete(PARAM_KEYS.START);
          prev.delete(PARAM_KEYS.END);
          prev.set(PARAM_KEYS.PAGE, "1"); // Reset to page 1

          if (range.presetId) {
            prev.set(PARAM_KEYS.PRESET, range.presetId);
          } else {
            prev.set(PARAM_KEYS.START, range.startTime);
            prev.set(PARAM_KEYS.END, range.endTime);
          }
          return prev;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setStoreId = useCallback(
    (id: string) => {
      setSearchParams(
        (prev) => {
          if (id) {
            prev.set(PARAM_KEYS.STORE, id);
          } else {
            prev.delete(PARAM_KEYS.STORE);
          }
          prev.set(PARAM_KEYS.PAGE, "1");
          return prev;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setStatus = useCallback(
    (newStatus: OrderStatus | undefined) => {
      setSearchParams(
        (prev) => {
          if (newStatus) {
            prev.set(PARAM_KEYS.STATUS, newStatus);
          } else {
            prev.delete(PARAM_KEYS.STATUS);
          }
          prev.set(PARAM_KEYS.PAGE, "1");
          return prev;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setCustomerId = useCallback(
    (id: string) => {
      setSearchParams(
        (prev) => {
          if (id) {
            prev.set(PARAM_KEYS.CUSTOMER, id);
          } else {
            prev.delete(PARAM_KEYS.CUSTOMER);
          }
          prev.set(PARAM_KEYS.PAGE, "1");
          return prev;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setSearch = useCallback(
    (searchVal: string) => {
      setSearchParams(
        (prev) => {
          if (searchVal) {
            prev.set(PARAM_KEYS.SEARCH, searchVal);
          } else {
            prev.delete(PARAM_KEYS.SEARCH);
          }
          prev.set(PARAM_KEYS.PAGE, "1");
          return prev;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setPage = useCallback(
    (pageNum: number) => {
      setSearchParams(
        (prev) => {
          prev.set(PARAM_KEYS.PAGE, pageNum.toString());
          return prev;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const resetFilters = useCallback(() => {
    setSearchParams(
      (prev) => {
        prev.delete(PARAM_KEYS.STORE);
        prev.delete(PARAM_KEYS.STATUS);
        prev.delete(PARAM_KEYS.CUSTOMER);
        prev.delete(PARAM_KEYS.SEARCH);
        prev.delete(PARAM_KEYS.START);
        prev.delete(PARAM_KEYS.END);
        prev.set(PARAM_KEYS.PRESET, defaultPreset);
        prev.set(PARAM_KEYS.PAGE, "1");
        if (defaultStatus) {
          prev.set(PARAM_KEYS.STATUS, defaultStatus);
        }
        return prev;
      },
      { replace: true },
    );
  }, [setSearchParams, defaultPreset, defaultStatus]);

  const hasActiveFilters = useMemo(() => {
    const currentPreset = searchParams.get(PARAM_KEYS.PRESET);
    return (
      search !== "" ||
      storeId !== "" ||
      customerId !== "" ||
      (status !== defaultStatus && status !== undefined) ||
      (currentPreset !== defaultPreset && currentPreset !== null)
    );
  }, [search, storeId, customerId, status, defaultStatus, searchParams, defaultPreset]);

  return {
    timeRange,
    setTimeRange,
    storeId,
    setStoreId,
    status,
    setStatus,
    customerId,
    setCustomerId,
    search,
    setSearch,
    page,
    setPage,
    resetFilters,
    hasActiveFilters,
  };
}
