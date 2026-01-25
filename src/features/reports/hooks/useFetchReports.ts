import { useDataFetch } from "@/hooks/useDataFetch";
import { analyticsApiService } from "@/infrastructure/AnalyticsApiService";
import type { ReportsRequest, ReportsResponse } from "@/types/analytics.types";
import { useCallback } from "react";

const initialState = {
  data: [] as ReportsResponse,
  isFetching: false,
  isError: false,
  isSuccess: false,
  errorMessage: null as string | null,
};

export function useFetchReports(
  request: ReportsRequest,
  disableAutoFetch = false,
) {
  const fetchFn = useCallback(
    () => analyticsApiService.getReports(request),
    [request],
  );

  return useDataFetch(fetchFn, initialState, disableAutoFetch);
}
