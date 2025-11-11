import { useDataFetch } from "@/hooks/useDataFetch";
import { orderApiService } from "@/infrastructure/OrderApiService";
import type { OrderQueryParams } from "@/types/order.types";
import { useCallback } from "react";

export const useFetchOrderList = (params: OrderQueryParams) => {
  const fetchFn = useCallback(
    () => orderApiService.fetchOrders(params),
    [params],
  );

  return useDataFetch(fetchFn, {
    data: { data: [], meta: null },
    isFetching: false,
    isError: false,
    isSuccess: false,
    errorMessage: null,
  });
};
