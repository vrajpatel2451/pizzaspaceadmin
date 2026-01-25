import type {
  DashboardField,
  DashboardRequestBody,
  DashboardResponse,
} from "@/types/analytics.types";
import { useCallback, useMemo, useState } from "react";
import { getDefaultTimeRange } from "../constants/timeRangePresets";
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

export function useDashboardState(): UseDashboardStateReturn {
  // State
  const [timeRange, setTimeRange] = useState<TimeRange>(getDefaultTimeRange);
  const [selectedStoreIds, setSelectedStoreIds] = useState<string[]>([]);

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

  // Callbacks
  const handleSetTimeRange = useCallback((range: TimeRange) => {
    setTimeRange(range);
  }, []);

  const handleSetSelectedStoreIds = useCallback((ids: string[]) => {
    setSelectedStoreIds(ids);
  }, []);

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
