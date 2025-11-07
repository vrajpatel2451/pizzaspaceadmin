import {
  useDataFetch,
  type DataState,
  type FetchFunction,
} from "@/hooks/useDataFetch";
import { discountApiService } from "@/infrastructure/DiscountApiService";
import type { DiscountResponse } from "@/types/discount.types";
import { useCallback, useMemo } from "react";

export const useFetchDiscountDetails = (
  discountId: string,
  disableAutoFetch = false,
) => {
  const initialState = useMemo<DataState<DiscountResponse>>(
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

  const fetchFn = useCallback<FetchFunction<DiscountResponse>>(async () => {
    const result = await discountApiService.getDiscountDetails(discountId);
    return result;
  }, [discountId]);

  return useDataFetch(fetchFn, initialState, disableAutoFetch);
};
