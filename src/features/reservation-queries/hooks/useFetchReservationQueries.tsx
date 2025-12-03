import {
  useDataFetch,
  type DataState,
  type FetchFunction,
} from "@/hooks/useDataFetch";
import { reservationQueryApiService } from "@/infrastructure/ReservationQueryApiService";
import type { PaginatedResponse } from "@/types/baseApi.types";
import type {
  ReservationQueryQueryParams,
  ReservationQueryResponse,
} from "@/types/reservationQuery.types";
import { useCallback, useMemo } from "react";

export const useFetchReservationQueriesList = (
  query: ReservationQueryQueryParams,
  disableAutoFetch = false
) => {
  const initialState = useMemo<
    DataState<PaginatedResponse<ReservationQueryResponse>>
  >(
    () => ({
      data: null,
      error: null,
      errorMessage: "",
      isError: false,
      isFetching: !disableAutoFetch,
      isSuccess: false,
    }),
    [disableAutoFetch]
  );

  const fetchFn = useCallback<
    FetchFunction<PaginatedResponse<ReservationQueryResponse>>
  >(async () => {
    const result =
      await reservationQueryApiService.fetchReservationQueriesList(query);
    return result;
  }, [query]);

  return useDataFetch(fetchFn, initialState, disableAutoFetch);
};
