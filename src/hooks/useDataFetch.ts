import type { BaseApiResponse } from "@/types/baseApi.types";
import { useCallback, useEffect, useRef, useState } from "react";

export type FetchFunction<R> = () => Promise<BaseApiResponse<R>>;
export type DataState<R, E> = {
  data: R;
  isFetching: boolean;
  isError: boolean;
  isSuccess: boolean;
  errorMessage: string;
  error: E;
};

export const useDataFetch = <R, E = unknown>(
  fetchFn: FetchFunction<R>,
  initialState: DataState<R, E>,
  disableAutoFetch = false,
) => {
  const unmounted = useRef(false);
  const prevData = useRef<R>(initialState.data);
  const [status, setData] = useState<DataState<R, E>>(initialState);

  const { data, error, isError, isFetching, isSuccess, errorMessage } = status;

  const fetch = useCallback(async () => {
    if (!unmounted.current) {
      setData({
        data: prevData.current,
        errorMessage: "",
        error: null,
        isError: false,
        isFetching: true,
        isSuccess: false,
      });
    }
    const { data: d, success: s, errorMessage: e } = await fetchFn();
    if (!unmounted.current) {
      prevData.current = d;
      setData({
        data: d,
        errorMessage: e,
        error: null,
        isError: !s,
        isSuccess: s,
        isFetching: false,
      });
    }
  }, [fetchFn]);

  useEffect(() => {
    unmounted.current = false;
    if (!disableAutoFetch) {
      fetch();
    }
    return () => {
      unmounted.current = true;
    };
  }, [disableAutoFetch, fetch]);

  return {
    data,
    error,
    isError,
    isFetching,
    isSuccess,
    errorMessage,
    refetch: fetch,
    setData,
  };
};
