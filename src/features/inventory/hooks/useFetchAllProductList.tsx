import {
  useDataFetch,
  type DataState,
  type FetchFunction,
} from "@/hooks/useDataFetch";
import { productApiService } from "@/infrastructure/ProductApiService";
import type { PaginatedResponse } from "@/types/baseApi.types";
import type {
  ProductQueryParams,
  ProductResponse,
} from "@/types/product.types";
import { useCallback, useMemo } from "react";

export const useFetchAllProductList = (
  queryParams: ProductQueryParams,
  disableAutoFetch = false,
) => {
  const initialState = useMemo<DataState<PaginatedResponse<ProductResponse>>>(
    () => ({
      data: null,
      errorMessage: "",
      isError: false,
      isFetching: true,
      isSuccess: false,
    }),
    [],
  );

  const fetchFn = useCallback<
    FetchFunction<PaginatedResponse<ProductResponse>>
  >(async () => {
    const result = await productApiService.getProductList(queryParams);
    return result;
  }, [queryParams]);

  return useDataFetch(fetchFn, initialState, disableAutoFetch);
};
