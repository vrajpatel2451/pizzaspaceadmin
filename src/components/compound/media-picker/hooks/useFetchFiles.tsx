import {
  useDataFetch,
  type DataState,
  type FetchFunction,
} from "@/hooks/useDataFetch";
import { fileApiService } from "@/infrastructure/FileApiService";
import type { PaginatedResponse } from "@/types/baseApi.types";
import type { FileQueryParams, FileResponse } from "@/types/file.types";
import { useCallback, useMemo } from "react";

export const useFetchFileList = (
  query: FileQueryParams,
  disableAutoFetch = false,
) => {
  const initialState = useMemo<
    DataState<PaginatedResponse<FileResponse>, string>
  >(
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
    FetchFunction<PaginatedResponse<FileResponse>>
  >(async () => {
    const result = await fileApiService.fetchFiles(query);
    return result;
  }, [query]);

  return useDataFetch(fetchFn, initialState, disableAutoFetch);
};
