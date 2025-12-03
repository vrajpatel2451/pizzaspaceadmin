import {
  useDataFetch,
  type DataState,
  type FetchFunction,
} from "@/hooks/useDataFetch";
import { logoApiService } from "@/infrastructure/LogoApiService";
import type { LogoResponse } from "@/types/logo.types";
import { useCallback, useMemo } from "react";

export const useFetchLogosList = (disableAutoFetch = false) => {
  const initialState = useMemo<DataState<LogoResponse[]>>(
    () => ({
      data: [],
      error: null,
      errorMessage: "",
      isError: false,
      isFetching: !disableAutoFetch,
      isSuccess: false,
    }),
    [disableAutoFetch]
  );

  const fetchFn = useCallback<FetchFunction<LogoResponse[]>>(async () => {
    const result = await logoApiService.fetchLogosList();
    return result;
  }, []);

  return useDataFetch(fetchFn, initialState, disableAutoFetch);
};
