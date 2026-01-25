import type {
  DashboardField,
  DashboardRequestBody,
  DashboardResponse,
} from "@/types/analytics.types";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getDefaultTimeRange,
  getPresetById,
} from "../constants/timeRangePresets";
import type { TimeRange } from "../types/timeRange.types";
import { useFetchDashboardResponse } from "./useFetchDashboardResponse";
import { calculateSpans } from "./useTimeRangeSpans";

interface UseDashboardStateReturn {
  // State
  timeRange: TimeRange;
  selectedStoreIds: string[];

  // Actions
  setTimeRange: (range: TimeRange) => void;
  setSelectedStoreIds: (ids: string[]) => void;
  refetch: () => void;

  // Data
  data: DashboardResponse | null;
  isFetching: boolean;
  isError: boolean;
  errorMessage: string;
}

// All fields we want to fetch from the API
const ALL_DASHBOARD_FIELDS: DashboardField[] = [
  // Order status counts
  "initiatedOrders",
  "confirmedNewOrders",
  "paymentErrorOrders",
  "cancelledOrders",
  "ordersInPreparing",
  "readyToPickupOrders",
  "onTheWayOrders",
  "deliveredOrders",
  // Store stats
  "totalStores",
  "totalStaff",
  // Customer/Revenue
  "totalCustomers",
  "totalRevenue",
  // Timeline charts
  "orderCountTimelineWise",
  "orderRevenueTimelineWise",
  // Order queries/tickets
  "totalOrderQueries",
  // Order reviews
  "totalOrderReviews",
  "averageOrderReviews",
  // Order item reviews
  "totalOrderItemReviews",
  "averageOrderItemReviews",
  // Reservations
  "reservationRequests",
  // General ratings
  "totalGeneralRatings",
  "averageGeneralRatings",
  // Contact form
  "totalContactFormQueries",
];

// URL param keys
const PARAM_KEYS = {
  PRESET: "preset",
  START: "start",
  END: "end",
  STORES: "stores",
} as const;

function parseTimeRangeFromParams(searchParams: URLSearchParams): TimeRange {
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

  // Default to today
  return getDefaultTimeRange();
}

function parseStoreIdsFromParams(searchParams: URLSearchParams): string[] {
  const storesParam = searchParams.get(PARAM_KEYS.STORES);
  if (!storesParam) return [];
  return storesParam.split(",").filter(Boolean);
}

export function useDashboardState(): UseDashboardStateReturn {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse state from URL
  const timeRange = useMemo(
    () => parseTimeRangeFromParams(searchParams),
    [searchParams],
  );

  const selectedStoreIds = useMemo(
    () => parseStoreIdsFromParams(searchParams),
    [searchParams],
  );

  // Set default params if none exist
  useEffect(() => {
    const hasAnyParam =
      searchParams.has(PARAM_KEYS.PRESET) ||
      searchParams.has(PARAM_KEYS.START) ||
      searchParams.has(PARAM_KEYS.END);

    if (!hasAnyParam) {
      const defaultRange = getDefaultTimeRange();
      if (defaultRange.presetId) {
        setSearchParams(
          (prev) => {
            prev.set(PARAM_KEYS.PRESET, defaultRange.presetId!);
            return prev;
          },
          { replace: true },
        );
      }
    }
  }, []);

  // Calculate spans based on time range
  const spans = useMemo(() => calculateSpans(timeRange), [timeRange]);

  // Build request body
  const requestBody = useMemo<DashboardRequestBody>(
    () => ({
      storeIds: selectedStoreIds.length > 0 ? selectedStoreIds : undefined,
      startTime: timeRange.startTime,
      endTime: timeRange.endTime,
      spans,
      includingFields: ALL_DASHBOARD_FIELDS,
    }),
    [selectedStoreIds, timeRange, spans],
  );

  // Fetch data
  const { data, isFetching, isError, errorMessage, refetch } =
    useFetchDashboardResponse(requestBody, false);

  // Update URL when time range changes
  const handleSetTimeRange = useCallback(
    (range: TimeRange) => {
      setSearchParams(
        (prev) => {
          // Clear old time params
          prev.delete(PARAM_KEYS.PRESET);
          prev.delete(PARAM_KEYS.START);
          prev.delete(PARAM_KEYS.END);

          if (range.presetId) {
            // Use preset
            prev.set(PARAM_KEYS.PRESET, range.presetId);
          } else {
            // Use custom range
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

  // Update URL when store selection changes
  const handleSetSelectedStoreIds = useCallback(
    (ids: string[]) => {
      setSearchParams(
        (prev) => {
          if (ids.length > 0) {
            prev.set(PARAM_KEYS.STORES, ids.join(","));
          } else {
            prev.delete(PARAM_KEYS.STORES);
          }
          return prev;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return {
    // State
    timeRange,
    selectedStoreIds,

    // Actions
    setTimeRange: handleSetTimeRange,
    setSelectedStoreIds: handleSetSelectedStoreIds,
    refetch,

    // Data
    data,
    isFetching,
    isError,
    errorMessage,
  };
}
