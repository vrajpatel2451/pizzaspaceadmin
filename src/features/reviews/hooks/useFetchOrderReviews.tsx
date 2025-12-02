import { useDataFetch } from "@/hooks/useDataFetch";
import { reviewApiService } from "@/infrastructure/ReviewApiService";
import type { OrderReviewQueryParams } from "@/types/review.types";
import { useCallback } from "react";

export const useFetchOrderReviews = (params: OrderReviewQueryParams) => {
  const fetchFn = useCallback(
    () => reviewApiService.fetchOrderReviews(params),
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
