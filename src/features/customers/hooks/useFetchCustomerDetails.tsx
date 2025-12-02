import {
  useDataFetch,
  type DataState,
  type FetchFunction,
} from "@/hooks/useDataFetch";
import { userApiService } from "@/infrastructure/UserApiService";
import type { UserResponse } from "@/types/user.types";
import { useCallback, useMemo } from "react";

export const useFetchCustomerDetails = (
  customerId: string | undefined,
  disableAutoFetch = false,
) => {
  const initialState = useMemo<DataState<UserResponse>>(
    () => ({
      data: null,
      error: null,
      errorMessage: "",
      isError: false,
      isFetching: !disableAutoFetch && !!customerId,
      isSuccess: false,
    }),
    [disableAutoFetch, customerId],
  );

  const fetchFn = useCallback<FetchFunction<UserResponse>>(async () => {
    if (!customerId) {
      return {
        data: null,
        success: false,
        errorMessage: "Customer ID is required",
      };
    }
    const result = await userApiService.getUser(customerId);
    return result;
  }, [customerId]);

  return useDataFetch(fetchFn, initialState, disableAutoFetch || !customerId);
};
