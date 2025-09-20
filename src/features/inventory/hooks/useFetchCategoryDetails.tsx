import {
  useDataFetch,
  type DataState,
  type FetchFunction,
} from "@/hooks/useDataFetch";
import { categoryApiService } from "@/infrastructure/CategoryApiService";
import type { CategoryResponse } from "@/types/category.types";
import { useCallback, useMemo } from "react";

export const useFetchCategoryDetails = (
  id: string,
  disableAutoFetch = false,
) => {
  const initialState = useMemo<DataState<CategoryResponse, string>>(
    () => ({
      data: null,
      error: null,
      errorMessage: "",
      isError: false,
      isFetching: true,
      isSuccess: false,
    }),
    [],
  );

  const fetchFn = useCallback<FetchFunction<CategoryResponse>>(async () => {
    const result = await categoryApiService.getCategoryDetails(id);
    return result;
  }, [id]);

  return useDataFetch(fetchFn, initialState, disableAutoFetch);
};
