import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export const useMenuUrlParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryIdFromUrl = searchParams.get("categoryId");
  const subCategoryIdFromUrl = searchParams.get("subCategoryId");

  const updateUrlParams = useCallback(
    (categoryId?: string, subCategoryId?: string) => {
      const newParams = new URLSearchParams();

      if (categoryId) {
        newParams.set("categoryId", categoryId);
      }
      if (subCategoryId) {
        newParams.set("subCategoryId", subCategoryId);
      }

      setSearchParams(newParams, { replace: true });
    },
    [setSearchParams],
  );

  const clearUrlParams = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  return {
    categoryIdFromUrl,
    subCategoryIdFromUrl,
    updateUrlParams,
    clearUrlParams,
  };
};
