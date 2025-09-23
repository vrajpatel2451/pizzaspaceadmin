import {
  useDataFetch,
  type DataState,
  type FetchFunction,
} from "@/hooks/useDataFetch";
import { categoryApiService } from "@/infrastructure/CategoryApiService";
import type { PaginatedResponse } from "@/types/baseApi.types";
import type {
  CategoryQueryParams,
  CategoryResponse,
} from "@/types/category.types";
import { useCallback, useMemo } from "react";

export const useFetchCategoryList = (
  query: CategoryQueryParams,
  disableAutoFetch = false,
) => {
  const initialState = useMemo<DataState<PaginatedResponse<CategoryResponse>>>(
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
    FetchFunction<PaginatedResponse<CategoryResponse>>
  >(async () => {
    const result = await categoryApiService.fetchCategories(query);
    return result;
  }, [query]);

  return useDataFetch(fetchFn, initialState, disableAutoFetch);
};
