import {
  useDataFetch,
  type DataState,
  type FetchFunction,
} from "@/hooks/useDataFetch";
import { discountApiService } from "@/infrastructure/DiscountApiService";
import type {
  ApplicableDiscountsParams,
  DiscountResponse,
} from "@/types/discount.types";
import { useCallback, useMemo } from "react";

export const useFetchApplicableDiscounts = (
  params: ApplicableDiscountsParams,
  disableAutoFetch = false,
) => {
  const initialState = useMemo<DataState<DiscountResponse[]>>(
    () => ({
      data: [],
      errorMessage: "",
      isError: false,
      isFetching: !disableAutoFetch,
      isSuccess: false,
    }),
    [disableAutoFetch],
  );

  const fetchFn = useCallback<FetchFunction<DiscountResponse[]>>(async () => {
    const result =
      await discountApiService.getApplicableDiscountsForUser(params);
    return result;
  }, [params]);

  return useDataFetch(fetchFn, initialState, disableAutoFetch);
};
