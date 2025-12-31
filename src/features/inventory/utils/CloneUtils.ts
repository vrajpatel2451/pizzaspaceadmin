import { v4 as uuidv4 } from "uuid";
import type { AddonGroupResponse, AddonResponse } from "@/types/addon.types";
import type { VariantPricingResponse } from "@/types/variantPricing.types";
import type { VariantGroupResponse, VariantResponse } from "@/types/variants.types";
import type {
  VariantFormData,
  VariantPricingData,
  VariantGroupData,
  VariantData,
} from "../variants/VariantStepperForm";
import type {
  AddonFormData,
  AddonPricingData,
  AddonGroupData,
  AddonData,
} from "../addons/AddonStepperForm";

/**
 * Data structure returned by clone transformation
 */
export interface ClonedProductData {
  variantFormData: VariantFormData;
  pricingFormData: VariantPricingData[];
  addonFormData: AddonFormData;
  addonPricingFormData: AddonPricingData[];
}

/**
 * Input data for clone transformation
 */
export interface CloneSourceData {
  variantGroupList: VariantGroupResponse[];
  variantList: VariantResponse[];
  pricing: VariantPricingResponse[];
  addonGroupList: AddonGroupResponse[];
  addonList: AddonResponse[];
}

/**
 * Utility class for cloning product data
 * Handles transformation of IDs and marking entities as new
 */
export class CloneUtils {
  /**
   * Transform product data for cloning
   * - Generates new UUIDs for variants and pricing
   * - Marks all entities as new
   * - Preserves addon selections and pricing values
   */
  static transformForClone(
    sourceData: CloneSourceData,
    allAddonGroups: AddonGroupResponse[],
    allAddons: AddonResponse[]
  ): ClonedProductData {
    const {
      variantGroupList,
      variantList,
      pricing,
      addonGroupList,
      addonList,
    } = sourceData;

    // 1. Transform variants with new IDs and get ID mapping
    const { variantFormData, idMapping } = this.transformVariants(
      variantGroupList || [],
      variantList || []
    );

    // 2. Transform variant pricing with new IDs (type="variant")
    const variantPricing = (pricing || []).filter((p) => p.type === "variant");
    const pricingFormData = this.transformVariantPricing(variantPricing, idMapping);

    // 3. Transform addon form data (preserve selections)
    const selectedGroupIds = (addonGroupList || []).map((g) => g._id);
    const selectedAddonIds = (addonList || []).map((a) => a._id);
    const addonFormData = this.transformAddonFormData(
      allAddonGroups,
      allAddons,
      selectedGroupIds,
      selectedAddonIds
    );

    // 4. Transform addon pricing with new IDs (type="addon" or "addonGroup")
    const addonPricing = (pricing || []).filter(
      (p) => p.type === "addon" || p.type === "addonGroup"
    );
    const addonPricingFormData = this.transformAddonPricing(addonPricing, idMapping);

    return {
      variantFormData,
      pricingFormData,
      addonFormData,
      addonPricingFormData,
    };
  }

  /**
   * Transform variant groups and variants for cloning
   * Generates new UUIDs and marks all as new
   */
  private static transformVariants(
    variantGroups: VariantGroupResponse[],
    variants: VariantResponse[]
  ): { variantFormData: VariantFormData; idMapping: Map<string, string> } {
    const idMapping = new Map<string, string>();

    if (!variantGroups || variantGroups.length === 0) {
      return {
        variantFormData: { variantGroups: [] },
        idMapping,
      };
    }

    const clonedGroups: VariantGroupData[] = variantGroups.map((group) => {
      // Generate new ID for group
      const newGroupId = uuidv4();
      idMapping.set(group._id, newGroupId);

      // Get variants belonging to this group
      const groupVariants = variants.filter((v) => v.groupId === group._id);

      // Clone variants with new IDs
      const clonedVariants: VariantData[] = groupVariants.map((variant) => {
        const newVariantId = uuidv4();
        idMapping.set(variant._id, newVariantId);

        return {
          _id: newVariantId,
          isNew: true, // Mark as new
          isPrimary: group.isPrimary,
          label: variant.label,
          groupId: newGroupId, // Reference new group ID
          price: variant.price,
          storeIds: variant.storeIds ? [...variant.storeIds] : [],
          maxItems: variant.maxItems,
          maxItemTypes: variant.maxItemTypes,
        };
      });

      return {
        _id: newGroupId,
        description: group.description,
        isNew: true, // Mark as new
        isPrimary: group.isPrimary,
        label: group.label,
        variants: clonedVariants,
        storeIds: group.storeIds ? [...group.storeIds] : [],
      };
    });

    return {
      variantFormData: { variantGroups: clonedGroups },
      idMapping,
    };
  }

  /**
   * Transform variant pricing entries for cloning
   * Updates variant references using ID mapping
   */
  private static transformVariantPricing(
    pricing: VariantPricingResponse[],
    idMapping: Map<string, string>
  ): VariantPricingData[] {
    if (!pricing || pricing.length === 0) {
      return [];
    }

    return pricing.map((p) => ({
      _id: uuidv4(), // New ID
      isNew: true, // Mark as new
      isVisible: p.isVisible,
      price: p.price,
      type: p.type as "variant" | "addon" | "addonGroup",
      // Map old IDs to new IDs
      variantGroupId: idMapping.get(p.variantGroupId) || p.variantGroupId,
      variantId: idMapping.get(p.variantId) || p.variantId,
      subVariantId: p.subVariantId
        ? idMapping.get(p.subVariantId) || p.subVariantId
        : undefined,
      // productId will be undefined for clone (new product)
    }));
  }

  /**
   * Transform addon form data for cloning
   * Preserves addon selections from original product
   * NOTE: Addon IDs remain the same (they're shared catalog items)
   */
  private static transformAddonFormData(
    allAddonGroups: AddonGroupResponse[],
    allAddons: AddonResponse[],
    selectedGroupIds: string[],
    selectedAddonIds: string[]
  ): AddonFormData {
    if (!allAddonGroups || allAddonGroups.length === 0) {
      return null;
    }

    const selectedGroupSet = new Set(selectedGroupIds);
    const selectedAddonSet = new Set(selectedAddonIds);

    return allAddonGroups.map((group): AddonGroupData => ({
      _id: group._id, // Keep original addon group IDs (shared catalog)
      label: group.label,
      allowMulti: group.allowMulti,
      min: group.min,
      max: group.max,
      description: group.description,
      isSelected: selectedGroupSet.has(group._id),
      addons: allAddons
        .filter((a) => a.groupId === group._id)
        .map((addon): AddonData => ({
          _id: addon._id, // Keep original addon IDs (shared catalog)
          label: addon.label,
          price: addon.price,
          groupId: addon.groupId,
          isSelected: selectedAddonSet.has(addon._id),
        })),
    }));
  }

  /**
   * Transform addon pricing entries for cloning
   * Updates variant references using ID mapping
   * NOTE: Addon IDs remain the same (they're shared catalog items)
   */
  private static transformAddonPricing(
    pricing: VariantPricingResponse[],
    idMapping: Map<string, string>
  ): AddonPricingData[] {
    if (!pricing || pricing.length === 0) {
      return [];
    }

    return pricing.map((p) => ({
      _id: uuidv4(), // New ID
      isNew: true, // Mark as new
      isVisible: p.isVisible,
      price: p.price,
      type: p.type as "addon" | "addonGroup",
      // Map old variant IDs to new IDs (variants get new IDs)
      variantGroupId: p.variantGroupId
        ? idMapping.get(p.variantGroupId) || p.variantGroupId
        : undefined,
      variantId: p.variantId
        ? idMapping.get(p.variantId) || p.variantId
        : undefined,
      // Keep original addon IDs (shared catalog)
      addonGroupId: p.addonGroupId,
      addonId: p.addonId,
      // productId will be undefined for clone (new product)
    }));
  }
}
