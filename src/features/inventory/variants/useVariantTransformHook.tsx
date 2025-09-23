import type { VariantPricingResponse } from "@/types/variantPricing.types";
import type {
  VariantGroupResponse,
  VariantResponse,
} from "@/types/variants.types";
import { useMemo } from "react";
import type { VariantFormData, VariantPricingData } from "./VariantStepperForm";
import { VariantUtils } from "./VariantUtils";

export type VariantTransformHookProps = {
  //   onClose: () => void;
  //   onSave: (
  //     variantGroups: VariantGroupEditData[],
  //     variants: VariantEditData[],
  //     deletedVariantIds: string[],
  //     deletedVariantGroupIds: string[],
  //     pricing: VariantPricingEditData[],
  //   ) => void;
  productId?: string;
  variantGroups: VariantGroupResponse[];
  variants: VariantResponse[];
  pricing: VariantPricingResponse[];
};

export const useVariantTransformHook = (props: VariantTransformHookProps) => {
  const { productId, pricing, variantGroups, variants } = props;
  //   const onSubmit = useCallback(
  //     (
  //       variantData: VariantFormData,
  //       pricingData: VariantPricingData[],
  //       deletedVariantIds: string[],
  //       deletedVariantGroupIds: string[],
  //     ) => {
  //       const modifiedResponse = VariantUtils.getModifiedDataFromFormData(
  //         variantData,
  //         pricingData,
  //         deletedVariantIds,
  //         deletedVariantGroupIds,
  //         productId,
  //       );
  //       onSave(
  //         modifiedResponse.variantGroups,
  //         modifiedResponse.variants,
  //         modifiedResponse.deletedVariantIds,
  //         modifiedResponse.deletedVariantGroupIds,
  //         modifiedResponse.pricing,
  //       );
  //       onClose();
  //     },
  //     [onClose, onSave, productId],
  //   );

  const defaultVariantFormData = useMemo<VariantFormData>(
    () =>
      VariantUtils.getFormDataOfVariantsFromResponse(
        variantGroups,
        variants,
        productId,
      ),
    [productId, variantGroups, variants],
  );

  const pricingFormData: VariantPricingData[] = useMemo(
    () => VariantUtils.getPricingFormData(pricing, productId),
    [pricing, productId],
  );

  return {
    // onSubmit,
    pricingFormData,
    defaultVariantFormData,
  };
};
