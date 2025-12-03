import {
  useDataFetch,
  type DataState,
  type FetchFunction,
} from "@/hooks/useDataFetch";
import { socialMediaApiService } from "@/infrastructure/SocialMediaApiService";
import type { SocialMediaResponse } from "@/types/socialMedia.types";
import { useCallback, useMemo } from "react";

export const useFetchSocialMediaList = (disableAutoFetch = false) => {
  const initialState = useMemo<DataState<SocialMediaResponse[]>>(
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

  const fetchFn = useCallback<FetchFunction<SocialMediaResponse[]>>(async () => {
    const result = await socialMediaApiService.fetchSocialMediaList();
    return result;
  }, []);

  return useDataFetch(fetchFn, initialState, disableAutoFetch);
};
