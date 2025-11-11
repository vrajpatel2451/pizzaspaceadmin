import { useDataFetch } from "@/hooks/useDataFetch";
import { orderApiService } from "@/infrastructure/OrderApiService";
import { useCallback } from "react";

export const useFetchOrderDetails = (orderId: string) => {
  const fetchFn = useCallback(
    () => orderApiService.fetchOrderById(orderId),
    [orderId],
  );

  return useDataFetch(fetchFn, {
    data: null,
    isFetching: false,
    isError: false,
    isSuccess: false,
    errorMessage: null,
  });
};
