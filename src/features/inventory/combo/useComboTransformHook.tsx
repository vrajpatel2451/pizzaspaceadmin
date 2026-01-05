import { useMemo } from "react";
import type {
  ComboFormData,
  ComboGroupProductResponse,
  ComboGroupResponse,
} from "@/types/product.types";
import { ComboUtils } from "./ComboUtils";

export type ComboTransformHookProps = {
  comboGroups?: ComboGroupResponse[];
  comboGroupProducts?: ComboGroupProductResponse[];
  productLookup?: Map<
    string,
    { name: string; photo?: string; category?: string; variants?: { _id: string; label: string }[] }
  >;
};

export const useComboTransformHook = (props: ComboTransformHookProps) => {
  const { comboGroups, comboGroupProducts, productLookup } = props;

  const defaultComboFormData = useMemo<ComboFormData>(() => {
    if (!comboGroups?.length) return [];
    return ComboUtils.getFormDataFromResponse(
      comboGroups,
      comboGroupProducts || [],
      productLookup,
    );
  }, [comboGroups, comboGroupProducts, productLookup]);

  return {
    defaultComboFormData,
  };
};
