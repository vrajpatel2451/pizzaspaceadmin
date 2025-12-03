import {
  useDataFetch,
  type DataState,
  type FetchFunction,
} from "@/hooks/useDataFetch";
import { policyApiService } from "@/infrastructure/PolicyApiService";
import type { PolicyListResponse } from "@/types/policy.types";
import { useCallback, useMemo } from "react";

export const useFetchPoliciesList = (disableAutoFetch = false) => {
  const initialState = useMemo<DataState<PolicyListResponse[]>>(
    () => ({
      data: [],
      error: null,
      errorMessage: "",
      isError: false,
      isFetching: !disableAutoFetch,
      isSuccess: false,
    }),
    [disableAutoFetch]
  );

  const fetchFn = useCallback<FetchFunction<PolicyListResponse[]>>(async () => {
    const result = await policyApiService.fetchPoliciesList();
    return result;
  }, []);

  return useDataFetch(fetchFn, initialState, disableAutoFetch);
};
