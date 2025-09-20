import {
  useDataFetch,
  type DataState,
  type FetchFunction,
} from "@/hooks/useDataFetch";
import { staffApiService } from "@/infrastructure/StaffApiService";
import type { StaffResponse } from "@/types/user.types";
import { useCallback, useMemo } from "react";

export const useFetchStaffDetails = (id: string, disableAutoFetch = false) => {
  const initialState = useMemo<DataState<StaffResponse, string>>(
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

  const fetchFn = useCallback<FetchFunction<StaffResponse>>(async () => {
    const result = await staffApiService.getStaffDetails(id);
    return result;
  }, [id]);

  return useDataFetch(fetchFn, initialState, disableAutoFetch);
};
