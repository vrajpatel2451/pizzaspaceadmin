import { useDataFetch } from "@/hooks/useDataFetch";
import { ticketApiService } from "@/infrastructure/TicketApiService";
import type { OrderTicketQueryParams } from "@/types/ticket.types";
import { useCallback } from "react";

export const useFetchOrderTickets = (params: OrderTicketQueryParams) => {
  const fetchFn = useCallback(
    () => ticketApiService.fetchOrderTickets(params),
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
