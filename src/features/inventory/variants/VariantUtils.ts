import type {
  VariantPricingEditData,
  VariantPricingResponse,
} from "@/types/variantPricing.types";
import type {
  VariantEditData,
  VariantGroupEditData,
  VariantGroupResponse,
  VariantResponse,
} from "@/types/variants.types";
import type {
  VariantData,
  VariantFormData,
  VariantGroupData,
  VariantPricingData,
} from "./VariantStepperForm";

export type ModifiedVariantData = {
  variantGroups: VariantGroupEditData[];
  variants: VariantEditData[];
  pricing: VariantPricingEditData[];
  deletedVariantIds: string[];
  deletedVariantGroupIds: string[];
};

export class VariantUtils {
  static getFormDataOfVariantsFromResponse(
    variantGroups: VariantGroupResponse[],
    variants: VariantResponse[],
    productId?: string,
  ): VariantFormData {
    const formData: VariantGroupData[] = [];
    if (variantGroups?.length) {
      for (const grp of variantGroups) {
        const variantDt: VariantData[] = [];
        if (variants?.length) {
          for (const vrt of variants) {
            if (vrt.groupId === grp._id) {
              variantDt.push({
                _id: vrt._id,
                isNew: false,
                isPrimary: grp.isPrimary ? true : false,
                label: vrt.label,
                groupId: vrt.groupId || grp._id,
                itemId: vrt.itemId || grp.itemId || productId,
                price: vrt.price,
                storeIds: vrt.storeIds,
                maxItems: vrt.maxItems,
                maxItemTypes: vrt.maxItemTypes,
              });
            }
          }
        }
        formData.push({
          _id: grp._id,
          description: grp.description,
          isNew: false,
          isPrimary: grp.isPrimary,
          label: grp.label,
          variants: variantDt,
          itemId: grp.itemId || productId,
          storeIds: grp.storeIds,
        });
      }
    }
    return {
      variantGroups: formData,
    };
  }
  static getModifiedDataFromFormData(
    variantData: VariantFormData,
    pricingData: VariantPricingData[],
    deletedVariantIds: string[],
    deletedVariantGroupIds: string[],
    productId?: string,
  ): ModifiedVariantData {
    const variantGroups: VariantGroupEditData[] = [];
    const variants: VariantEditData[] = [];
    const pricing: VariantPricingEditData[] = [];
    variantData?.variantGroups?.forEach((group) => {
      variantGroups.push({
        description: group.description,
        isPrimary: group.isPrimary,
        itemId: productId,
        label: group.label,
        storeIds: group.storeIds,
        _id: group._id,
        isNew: group.isNew,
      });
      group.variants?.forEach((variant) => {
        variants.push({
          _id: variant._id,
          groupId: group._id,
          isNew: variant.isNew,
          isPrimary: group.isPrimary,
          itemId: productId,
          label: variant.label,
          price: variant.price,
          storeIds: variant.storeIds,
          maxItems: variant.maxItems ?? 0,
          maxItemTypes: variant.maxItemTypes ?? "none",
        });
      });
    });
    pricingData.forEach((pr) => {
      pricing.push({
        _id: pr.isNew ? undefined : pr._id,
        addonGroupId: pr.type === "addonGroup" ? pr.addonGroupId : undefined,
        addonId: pr.type === "addon" ? pr.addonId : undefined,
        isVisible: pr.isVisible,
        price: pr.type !== "addonGroup" ? pr.price : undefined,
        productId,
        subVariantId: pr.type === "variant" ? pr.subVariantId : undefined,
        type: pr.type,
        variantGroupId: pr.variantGroupId,
        variantId: pr.variantId,
      });
    });

    return {
      deletedVariantGroupIds,
      deletedVariantIds,
      pricing,
      variantGroups,
      variants,
    };
  }

  static getPricingFormData(
    pricing: VariantPricingResponse[],
    productId?: string,
  ): VariantPricingData[] {
    return pricing.map<VariantPricingData>((pr) => ({
      _id: pr._id,
      isNew: false,
      isVisible: pr.isVisible,
      price: pr.price,
      type: pr.type,
      variantGroupId: pr.variantGroupId,
      variantId: pr.variantId,
      addonGroupId: pr.addonGroupId,
      addonId: pr.addonId,
      productId: pr.productId || productId,
      subVariantId: pr.subVariantId,
    }));
  }
}
