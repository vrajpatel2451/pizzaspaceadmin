import {
  useDataFetch,
  type DataState,
  type FetchFunction,
} from "@/hooks/useDataFetch";
import { cartApiService } from "@/infrastructure/CartApiService";
import type { PaginatedResponse } from "@/types/baseApi.types";
import type { CartQueryParams, CartResponse } from "@/types/cart.types";
import { useCallback, useMemo } from "react";

export const useFetchCartList = (
  query: CartQueryParams,
  disableAutoFetch = false,
) => {
  const initialState = useMemo<DataState<PaginatedResponse<CartResponse>>>(
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
    FetchFunction<PaginatedResponse<CartResponse>>
  >(async () => {
    const result = await cartApiService.fetchCartItems(query);
    return result;
  }, [query]);

  return useDataFetch(fetchFn, initialState, disableAutoFetch);
};
