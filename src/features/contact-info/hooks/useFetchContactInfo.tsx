import {
  useDataFetch,
  type DataState,
  type FetchFunction,
} from "@/hooks/useDataFetch";
import { contactInfoApiService } from "@/infrastructure/ContactInfoApiService";
import type { PaginatedResponse } from "@/types/baseApi.types";
import type {
  ContactInfoQueryParams,
  ContactInfoResponse,
} from "@/types/contactInfo.types";
import { useCallback, useMemo } from "react";

export const useFetchContactInfoList = (
  query: ContactInfoQueryParams,
  disableAutoFetch = false
) => {
  const initialState = useMemo<
    DataState<PaginatedResponse<ContactInfoResponse>>
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
    FetchFunction<PaginatedResponse<ContactInfoResponse>>
  >(async () => {
    const result = await contactInfoApiService.fetchContactInfoList(query);
    return result;
  }, [query]);

  return useDataFetch(fetchFn, initialState, disableAutoFetch);
};
