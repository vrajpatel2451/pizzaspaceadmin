import {
  type DataState,
  type FetchFunction,
  useDataFetch,
} from "@/hooks/useDataFetch";
import { orderTaxStructureApiService } from "@/infrastructure/OrderTaxStructureApiService";
import type { PaginatedResponse } from "@/types/baseApi.types";
import type {
  OrderTaxStructureQueryParams,
  OrderTaxStructureResponse,
} from "@/types/orderTaxStructure.types";
import { useCallback, useMemo } from "react";

export const useFetchOrderTaxStructureList = (
  query: OrderTaxStructureQueryParams,
  disableAutoFetch = false,
) => {
  const initialState = useMemo<
    DataState<PaginatedResponse<OrderTaxStructureResponse>>
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
    FetchFunction<PaginatedResponse<OrderTaxStructureResponse>>
  >(async () => {
    const result =
      await orderTaxStructureApiService.fetchOrderTaxStructures(query);
    return result;
  }, [query]);

  return useDataFetch(fetchFn, initialState, disableAutoFetch);
};
