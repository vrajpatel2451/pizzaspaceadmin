import {
  useDataFetch,
  type DataState,
  type FetchFunction,
} from "@/hooks/useDataFetch";
import { generalRatingApiService } from "@/infrastructure/GeneralRatingApiService";
import type { PaginatedResponse } from "@/types/baseApi.types";
import type {
  GeneralRatingQueryParams,
  GeneralRatingResponse,
} from "@/types/generalRating.types";
import { useCallback, useMemo } from "react";

export const useFetchGeneralRatingsList = (
  query: GeneralRatingQueryParams,
  disableAutoFetch = false
) => {
  const initialState = useMemo<
    DataState<PaginatedResponse<GeneralRatingResponse>>
  >(
    () => ({
      data: null,
      error: null,
      errorMessage: "",
      isError: false,
      isFetching: !disableAutoFetch,
      isSuccess: false,
    }),
    [disableAutoFetch]
  );

  const fetchFn = useCallback<
    FetchFunction<PaginatedResponse<GeneralRatingResponse>>
  >(async () => {
    const result = await generalRatingApiService.fetchGeneralRatingsList(query);
    return result;
  }, [query]);

  return useDataFetch(fetchFn, initialState, disableAutoFetch);
};
