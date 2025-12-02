import { useDataFetch } from "@/hooks/useDataFetch";
import { reviewApiService } from "@/infrastructure/ReviewApiService";
import type { OrderItemReviewQueryParams } from "@/types/review.types";
import { useCallback } from "react";

export const useFetchOrderItemReviews = (params: OrderItemReviewQueryParams) => {
  const fetchFn = useCallback(
    () => reviewApiService.fetchOrderItemReviews(params),
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
