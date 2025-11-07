import {
  useDataFetch,
  type DataState,
  type FetchFunction,
} from "@/hooks/useDataFetch";
import { addressApiService } from "@/infrastructure/AddressApiService";
import type { AddressResponse } from "@/types/user.types";
import { useCallback, useMemo } from "react";

export const useFetchUserAddresses = (
  userId: string,
  disableAutoFetch = false,
) => {
  const initialState = useMemo<DataState<AddressResponse[]>>(
    () => ({
      data: [],
      error: null,
      errorMessage: "",
      isError: false,
      isFetching: !disableAutoFetch,
      isSuccess: false,
    }),
    [disableAutoFetch],
  );

  const fetchFn = useCallback<FetchFunction<AddressResponse[]>>(async () => {
    const result = await addressApiService.getAddressesByUser(userId);
    return result;
  }, [userId]);

  return useDataFetch(fetchFn, initialState, disableAutoFetch);
};
