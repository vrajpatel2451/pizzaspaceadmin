import {
  useDataFetch,
  type DataState,
  type FetchFunction,
} from "@/hooks/useDataFetch";
import { staffApiService } from "@/infrastructure/StaffApiService";
import type { PaginatedResponse } from "@/types/baseApi.types";
import type { StaffQueryParams, StaffResponse } from "@/types/user.types";
import { useCallback, useMemo } from "react";

export const useFetchStaffList = (
  query: StaffQueryParams,
  disableAutoFetch = false,
) => {
  const initialState = useMemo<
    DataState<PaginatedResponse<StaffResponse>, string>
  >(
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

  const fetchFn = useCallback<
    FetchFunction<PaginatedResponse<StaffResponse>>
  >(async () => {
    const result = await staffApiService.fetchAllStaff(query);
    return result;
  }, [query]);

  return useDataFetch(fetchFn, initialState, disableAutoFetch);
};
