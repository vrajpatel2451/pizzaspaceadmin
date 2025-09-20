import {
  useDataFetch,
  type DataState,
  type FetchFunction,
} from "@/hooks/useDataFetch";
import { storeApiService } from "@/infrastructure/StoreApiService";
import { useCallback, useMemo } from "react";
import type { StoreResponse } from "../types/StoreTypes";

export const useFetchStoreDetails = (id: string, disableAutoFetch = false) => {
  const initialState = useMemo<DataState<StoreResponse, string>>(
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

  const fetchFn = useCallback<FetchFunction<StoreResponse>>(async () => {
    const result = await storeApiService.getStoresDetails(id);
    return result;
  }, [id]);

  return useDataFetch(fetchFn, initialState, disableAutoFetch);
};
