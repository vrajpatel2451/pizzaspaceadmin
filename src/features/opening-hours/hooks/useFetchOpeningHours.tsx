import {
  useDataFetch,
  type DataState,
  type FetchFunction,
} from "@/hooks/useDataFetch";
import { openingHoursApiService } from "@/infrastructure/OpeningHoursApiService";
import type { OpeningHoursResponse } from "@/types/openingHours.types";
import { useCallback, useMemo } from "react";

export const useFetchOpeningHoursList = (disableAutoFetch = false) => {
  const initialState = useMemo<DataState<OpeningHoursResponse[]>>(
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

  const fetchFn = useCallback<FetchFunction<OpeningHoursResponse[]>>(async () => {
    const result = await openingHoursApiService.fetchOpeningHoursList();
    return result;
  }, []);

  return useDataFetch(fetchFn, initialState, disableAutoFetch);
};
