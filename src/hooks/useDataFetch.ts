import type { BaseApiResponse } from "@/types/baseApi.types";
import { useCallback, useEffect, useRef, useState } from "react";

export type FetchFunction<R> = () => Promise<BaseApiResponse<R>>;
export type DataState<R> = {
  data: R;
  isFetching: boolean;
  isError: boolean;
  isSuccess: boolean;
  errorMessage: string;
};

export const useDataFetch = <R>(
  fetchFn: FetchFunction<R>,
  initialState: DataState<R>,
  disableAutoFetch = false,
) => {
  const unmounted = useRef(false);
  const prevData = useRef<R>(initialState.data);
  const [status, setData] = useState<DataState<R>>(initialState);

  const { data, isError, isFetching, isSuccess, errorMessage } = status;

  const fetch = useCallback(async () => {
    if (!unmounted.current) {
      setData({
        data: prevData.current,
        errorMessage: "",
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
    isError,
    isFetching,
    isSuccess,
    errorMessage,
    refetch: fetch,
    setData,
  };
};
