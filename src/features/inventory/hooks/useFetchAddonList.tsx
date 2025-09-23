import {
  useDataFetch,
  type DataState,
  type FetchFunction,
} from "@/hooks/useDataFetch";
import { addonApiService } from "@/infrastructure/AddonApiService";
import type { AddonApiResponse, AddonBulkGetParams } from "@/types/addon.types";
import { useCallback, useMemo } from "react";

export const useFetchAddonList = (
  params: AddonBulkGetParams,
  disableAutoFetch = false,
) => {
  const initialState = useMemo<DataState<AddonApiResponse>>(
    () => ({
      data: null,
      errorMessage: "",
      isError: false,
      isFetching: !disableAutoFetch,
      isSuccess: false,
    }),
    [disableAutoFetch],
  );

  const fetchFn = useCallback<FetchFunction<AddonApiResponse>>(async () => {
    const result = await addonApiService.getAddonList(params);
    return result;
  }, [params]);

  return useDataFetch(fetchFn, initialState, disableAutoFetch);
};
