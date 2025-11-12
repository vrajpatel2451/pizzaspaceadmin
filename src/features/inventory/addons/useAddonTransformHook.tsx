import type {
  AddonGroupResponse,
  AddonResponse,
} from "@/types/addon.types";
import type { VariantPricingResponse } from "@/types/variantPricing.types";
import { useMemo } from "react";
import type { VariantFormData } from "../variants/VariantStepperForm";
import type { AddonFormData, AddonPricingData } from "./AddonStepperForm";
import { AddonUtils } from "./AddonUtils";

export type AddonTransformHookProps = {
  productId?: string;
  addonGroups: AddonGroupResponse[];
  addons: AddonResponse[];
  pricing: VariantPricingResponse[];
  variantFormData: VariantFormData | null;
};

export const useAddonTransformHook = (props: AddonTransformHookProps) => {
  const { productId, pricing, addonGroups, addons, variantFormData: _variantFormData } = props;

  const defaultAddonFormData = useMemo<AddonFormData>(
    () =>
      AddonUtils.getFormDataFromResponse(
        addonGroups,
        addons,
        pricing,
        productId,
      ),
    [addonGroups, addons, pricing, productId],
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
