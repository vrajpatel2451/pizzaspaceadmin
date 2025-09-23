import {
  useDataFetch,
  type DataState,
  type FetchFunction,
} from "@/hooks/useDataFetch";
import { categoryApiService } from "@/infrastructure/CategoryApiService";
import type { CategoryResponse } from "@/types/category.types";
import { useCallback, useMemo } from "react";

export const useFetchAllCategoryList = (disableAutoFetch = false) => {
  const initialState = useMemo<DataState<CategoryResponse[]>>(
    () => ({
      data: [],
      errorMessage: "",
      isError: false,
      isFetching: !disableAutoFetch,
      isSuccess: false,
    }),
    [disableAutoFetch],
  );

  const fetchFn = useCallback<FetchFunction<CategoryResponse[]>>(async () => {
    const result = await categoryApiService.fetchAllCategories();
    return result;
  }, []);

  return useDataFetch(fetchFn, initialState, disableAutoFetch);
};
