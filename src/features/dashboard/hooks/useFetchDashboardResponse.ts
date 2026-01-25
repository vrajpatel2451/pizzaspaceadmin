import {
  useDataFetch,
  type DataState,
  type FetchFunction,
} from "@/hooks/useDataFetch";
import { analyticsApiService } from "@/infrastructure/AnalyticsApiService";
import type {
  DashboardRequestBody,
  DashboardResponse,
} from "@/types/analytics.types";
import { useCallback, useMemo } from "react";

export const useFetchDashboardResponse = (
  body: DashboardRequestBody,
  disableAutoFetch: boolean,
) => {
  const initialState = useMemo<DataState<DashboardResponse>>(
    () => ({
      data: null,
      error: null,
      errorMessage: "",
      isError: false,
      isFetching: !disableAutoFetch,
      isSuccess: false,
    }),
    [disableAutoFetch],
  );

  const fetchFn = useCallback<FetchFunction<DashboardResponse>>(async () => {
    const result = await analyticsApiService.getDashboardData(body);
    return result;
  }, [body]);

  return useDataFetch(fetchFn, initialState, disableAutoFetch);
};
