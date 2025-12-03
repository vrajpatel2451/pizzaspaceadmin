import {
  useDataFetch,
  type DataState,
  type FetchFunction,
} from "@/hooks/useDataFetch";
import { policyApiService } from "@/infrastructure/PolicyApiService";
import type { PolicyResponse } from "@/types/policy.types";
import { useCallback, useMemo } from "react";

export const useFetchPolicyById = (id: string, disableAutoFetch = false) => {
  const initialState = useMemo<DataState<PolicyResponse | null>>(
    () => ({
      data: null,
      error: null,
      errorMessage: "",
      isError: false,
      isFetching: !disableAutoFetch && !!id,
      isSuccess: false,
    }),
    [disableAutoFetch, id]
  );

  const fetchFn = useCallback<FetchFunction<PolicyResponse | null>>(async () => {
    if (!id) {
      return { data: null, success: true, errorMessage: null };
    }
    const result = await policyApiService.fetchPolicyById(id);
    return result;
  }, [id]);

  return useDataFetch(fetchFn, initialState, disableAutoFetch || !id);
};
