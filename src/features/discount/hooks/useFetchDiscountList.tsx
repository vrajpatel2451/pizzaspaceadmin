import {
  useDataFetch,
  type DataState,
  type FetchFunction,
} from "@/hooks/useDataFetch";
import { discountApiService } from "@/infrastructure/DiscountApiService";
import type { PaginatedResponse } from "@/types/baseApi.types";
import type {
  DiscountQueryParams,
  DiscountResponse,
} from "@/types/discount.types";
import { useCallback, useMemo } from "react";

export const useFetchDiscountList = (
  query: DiscountQueryParams,
  disableAutoFetch = false,
) => {
  const initialState = useMemo<DataState<PaginatedResponse<DiscountResponse>>>(
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
    FetchFunction<PaginatedResponse<DiscountResponse>>
  >(async () => {
    const result = await discountApiService.fetchDiscounts(query);
    return result;
  }, [query]);

  return useDataFetch(fetchFn, initialState, disableAutoFetch);
};
