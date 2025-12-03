import {
  useDataFetch,
  type DataState,
  type FetchFunction,
} from "@/hooks/useDataFetch";
import { contactQueryApiService } from "@/infrastructure/ContactQueryApiService";
import type { PaginatedResponse } from "@/types/baseApi.types";
import type {
  ContactQueryQueryParams,
  ContactQueryResponse,
} from "@/types/contactQuery.types";
import { useCallback, useMemo } from "react";

export const useFetchContactQueriesList = (
  query: ContactQueryQueryParams,
  disableAutoFetch = false
) => {
  const initialState = useMemo<
    DataState<PaginatedResponse<ContactQueryResponse>>
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
    FetchFunction<PaginatedResponse<ContactQueryResponse>>
  >(async () => {
    const result = await contactQueryApiService.fetchContactQueriesList(query);
    return result;
  }, [query]);

  return useDataFetch(fetchFn, initialState, disableAutoFetch);
};
