import {
  type DataState,
  type FetchFunction,
  useDataFetch,
} from "@/hooks/useDataFetch";
import { deliveryChargesApiService } from "@/infrastructure/DeliveryChargesApiService";
import type { PaginatedResponse } from "@/types/baseApi.types";
import type {
  DeliveryChargesQueryParams,
  DeliveryChargesResponse,
} from "@/types/deliveryCharges.types";
import { useCallback, useMemo } from "react";

export const useFetchDeliveryChargesList = (
  query: DeliveryChargesQueryParams,
  disableAutoFetch = false,
) => {
  const initialState = useMemo<
    DataState<PaginatedResponse<DeliveryChargesResponse>>
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
    FetchFunction<PaginatedResponse<DeliveryChargesResponse>>
  >(async () => {
    const result = await deliveryChargesApiService.fetchDeliveryCharges(query);
    return result;
  }, [query]);

  return useDataFetch(fetchFn, initialState, disableAutoFetch);
};
