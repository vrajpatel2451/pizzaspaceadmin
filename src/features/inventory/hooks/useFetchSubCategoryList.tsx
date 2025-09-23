import {
  useDataFetch,
  type DataState,
  type FetchFunction,
} from "@/hooks/useDataFetch";
import { subCategoryApiService } from "@/infrastructure/SubCategoryApiService";
import type { PaginatedResponse } from "@/types/baseApi.types";
import type {
  CategoryQueryParams,
  SubCategoryResponse,
} from "@/types/category.types";
import { useCallback, useMemo } from "react";

export const useFetchSubCategoryList = (
  query: CategoryQueryParams,
  disableAutoFetch = false,
) => {
  const initialState = useMemo<
    DataState<PaginatedResponse<SubCategoryResponse>>
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
    FetchFunction<PaginatedResponse<SubCategoryResponse>>
  >(async () => {
    const result = await subCategoryApiService.fetchSubCategories(query);
    return result;
  }, [query]);

  return useDataFetch(fetchFn, initialState, disableAutoFetch);
};
