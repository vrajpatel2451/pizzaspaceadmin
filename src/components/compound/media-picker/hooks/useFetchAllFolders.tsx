import {
  useDataFetch,
  type DataState,
  type FetchFunction,
} from "@/hooks/useDataFetch";
import { fileApiService } from "@/infrastructure/FileApiService";
import { useCallback, useMemo } from "react";

export const useFetchAllFolders = (disableAutoFetch = false) => {
  const initialState = useMemo<DataState<string[], string>>(
    () => ({
      data: [],
      error: null,
      errorMessage: "",
      isError: false,
      isFetching: !disableAutoFetch,
      isSuccess: false,
    }),
    [disableAutoFetch],
  );

  const fetchFn = useCallback<FetchFunction<string[]>>(async () => {
    const result = await fileApiService.fetchAllFolders();
    return result;
  }, []);

  return useDataFetch(fetchFn, initialState, disableAutoFetch);
};
