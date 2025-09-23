import {
  useDataFetch,
  type DataState,
  type FetchFunction,
} from "@/hooks/useDataFetch";
import { productApiService } from "@/infrastructure/ProductApiService";
import type { ProductDetailsResponse } from "@/types/product.types";
import { useCallback, useMemo } from "react";

export const useFetchProductDetails = (
  id: string,
  disableAutoFetch = false,
) => {
  const initialState = useMemo<DataState<ProductDetailsResponse>>(
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
    FetchFunction<ProductDetailsResponse>
  >(async () => {
    const result = await productApiService.getProduct(id);
    return result;
  }, [id]);

  return useDataFetch(fetchFn, initialState, disableAutoFetch);
};
