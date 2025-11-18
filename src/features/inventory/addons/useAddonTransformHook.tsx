import type { AddonGroupResponse, AddonResponse } from "@/types/addon.types";
import type { VariantPricingResponse } from "@/types/variantPricing.types";
import { useMemo } from "react";
import type { AddonFormData, AddonPricingData } from "./AddonStepperForm";
import { AddonUtils } from "./AddonUtils";

export type AddonTransformHookProps = {
  productId?: string;
  addonGroups: AddonGroupResponse[];
  addons: AddonResponse[];
  pricing: VariantPricingResponse[];
  // variantFormData: VariantFormData | null;
  productAddonGroupIds?: string[]; // IDs of addon groups assigned to product
  productAddonIds?: string[]; // IDs of addons assigned to product
};

export const useAddonTransformHook = (props: AddonTransformHookProps) => {
  const {
    productId,
    pricing,
    addonGroups,
    addons,
    // variantFormData: _variantFormData,
    productAddonGroupIds,
    productAddonIds,
  } = props;

  const defaultAddonFormData = useMemo<AddonFormData>(
    () =>
      AddonUtils.getFormDataFromResponse(
        addonGroups,
        addons,
        productAddonGroupIds,
        productAddonIds,
      ),
    [addonGroups, addons, productAddonGroupIds, productAddonIds],
  );

  const addonPricingFormData = useMemo<AddonPricingData[]>(
    () => AddonUtils.getPricingFormData(pricing, productId),
    [pricing, productId],
  );

  return {
    defaultAddonFormData,
    addonPricingFormData,
  };
};
