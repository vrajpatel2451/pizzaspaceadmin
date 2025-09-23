import {
  useDataFetch,
  type DataState,
  type FetchFunction,
} from "@/hooks/useDataFetch";
import { storeApiService } from "@/infrastructure/StoreApiService";
import type { PaginatedResponse } from "@/types/baseApi.types";
import { useCallback, useMemo } from "react";
import type { StoreQueryParams, StoreResponse } from "../types/StoreTypes";

export const useFetchStoreList = (
  query: StoreQueryParams,
  disableAutoFetch = false,
) => {
  const initialState = useMemo<DataState<PaginatedResponse<StoreResponse>>>(
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
    FetchFunction<PaginatedResponse<StoreResponse>>
  >(async () => {
    const result = await storeApiService.fetchStores(query);
    return result;
  }, [query]);

  return useDataFetch(fetchFn, initialState, disableAutoFetch);
};
