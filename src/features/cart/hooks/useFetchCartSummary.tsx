import {
  useDataFetch,
  type DataState,
  type FetchFunction,
} from "@/hooks/useDataFetch";
import { cartApiService } from "@/infrastructure/CartApiService";
import type {
  CustomerBillingOnCart,
  PricingForCartParamsForAdmin,
} from "@/types/pricing.types";
import { useCallback, useMemo } from "react";

export const useFetchCartSummary = (
  query: PricingForCartParamsForAdmin,
  disableAutoFetch = false,
) => {
  const initialState = useMemo<DataState<CustomerBillingOnCart>>(
    () => ({
      data: null,
      error: null,
      errorMessage: "",
      isError: false,
      isFetching: true,
      isSuccess: false,
    }),
    [],
  );

  const fetchFn = useCallback<
    FetchFunction<CustomerBillingOnCart>
  >(async () => {
    const result = await cartApiService.getSummary(query);
    return result;
  }, [query]);

  return useDataFetch(fetchFn, initialState, disableAutoFetch);
};
