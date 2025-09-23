import {
  useDataFetch,
  type DataState,
  type FetchFunction,
} from "@/hooks/useDataFetch";
import { subCategoryApiService } from "@/infrastructure/SubCategoryApiService";
import type { SubCategoryResponse } from "@/types/category.types";
import { useCallback, useMemo } from "react";

export const useFetchSubCategoryDetails = (
  id: string,
  disableAutoFetch = false,
) => {
  const initialState = useMemo<DataState<SubCategoryResponse>>(
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

  const fetchFn = useCallback<FetchFunction<SubCategoryResponse>>(async () => {
    if (id) {
      const result = await subCategoryApiService.getSubCategoryDetails(id);
      return result;
    }
    return await Promise.resolve({
      data: null,
      success: false,
      errorMessage: "Need to provide id",
    });
  }, [id]);

  return useDataFetch(fetchFn, initialState, disableAutoFetch);
};
