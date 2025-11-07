import {
  useDataFetch,
  type DataState,
  type FetchFunction,
} from "@/hooks/useDataFetch";
import { userApiService } from "@/infrastructure/UserApiService";
import type { PaginatedResponse } from "@/types/baseApi.types";
import type { UserQueryParams, UserResponse } from "@/types/user.types";
import { useCallback, useMemo } from "react";

export const useFetchUserList = (
  query: UserQueryParams,
  disableAutoFetch = false,
) => {
  const initialState = useMemo<DataState<PaginatedResponse<UserResponse>>>(
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

  const fetchFn = useCallback<FetchFunction<PaginatedResponse<UserResponse>>>(
    async () => {
      const result = await userApiService.getUserList(query);
      return result;
    },
    [query],
  );

  return useDataFetch(fetchFn, initialState, disableAutoFetch);
};
