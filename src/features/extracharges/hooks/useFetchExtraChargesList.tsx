import {
  type DataState,
  type FetchFunction,
  useDataFetch,
} from "@/hooks/useDataFetch";
import { extraChargesApiService } from "@/infrastructure/ExtraChargesApiService";
import type { PaginatedResponse } from "@/types/baseApi.types";
import type {
  ExtraChargesQueryParams,
  ExtraChargesResponse,
} from "@/types/extraCharges.types";
import { useCallback, useMemo } from "react";

export const useFetchExtraChargesList = (
  query: ExtraChargesQueryParams,
  disableAutoFetch = false,
) => {
  const initialState = useMemo<
    DataState<PaginatedResponse<ExtraChargesResponse>>
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
    FetchFunction<PaginatedResponse<ExtraChargesResponse>>
  >(async () => {
    const result = await extraChargesApiService.fetchExtraCharges(query);
    return result;
  }, [query]);

  return useDataFetch(fetchFn, initialState, disableAutoFetch);
};
