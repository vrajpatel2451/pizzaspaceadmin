import {
  useDataFetch,
  type DataState,
  type FetchFunction,
} from "@/hooks/useDataFetch";
import { productApiService } from "@/infrastructure/ProductApiService";
import type { PaginatedResponse } from "@/types/baseApi.types";
import type {
  ComboProductSearchItem,
  ComboProductSearchParams,
} from "@/types/product.types";
import { useCallback, useMemo } from "react";

export const useFetchComboProducts = (
  params: ComboProductSearchParams,
  disableAutoFetch = false,
) => {
  const initialState = useMemo<DataState<PaginatedResponse<ComboProductSearchItem> | null>>(
    () => ({
      data: null,
      error: null,
      errorMessage: "",
      isError: false,
      isFetching: false,
      isSuccess: false,
    }),
    [],
  );

  const fetchFn = useCallback<FetchFunction<PaginatedResponse<ComboProductSearchItem> | null>>(async () => {
    const result = await productApiService.getComboSearchItems(params);
    return result;
  }, [params]);

  return useDataFetch(fetchFn, initialState, disableAutoFetch);
};
