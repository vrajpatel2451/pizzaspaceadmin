import type { AddonGroupResponse, AddonResponse } from "@/types/addon.types";
import type {
  VariantPricingEditData,
  VariantPricingResponse,
} from "@/types/variantPricing.types";
import { v4 as uuidv4 } from "uuid";
import type { VariantFormData } from "../variants/VariantStepperForm";
import type {
  AddonData,
  AddonFormData,
  AddonGroupData,
  AddonPricingData,
} from "./AddonStepperForm";

export type ModifiedAddonData = {
  pricing: VariantPricingEditData[];
  addonIds: string[];
  addonGroupIds: string[];
};

export type PrimaryVariant = {
  _id: string;
  label: string;
  groupId: string;
};

export class AddonUtils {
  /**
   * Transform API response to form data structure
   * Marks addons as selected based on product's addon IDs (not pricing data)
   */
  static getFormDataFromResponse(
    addonGroups: AddonGroupResponse[],
    addons: AddonResponse[],
    productAddonGroupIds?: string[],
    productAddonIds?: string[],
  ): AddonFormData {
    const formData: AddonGroupData[] = [];

    // Create sets for O(1) lookup
    const selectedGroupIds = new Set(productAddonGroupIds || []);
    const selectedAddonIds = new Set(productAddonIds || []);

    if (addonGroups?.length) {
      for (const group of addonGroups) {
        // Check if this group is assigned to the product
        const isGroupSelected = selectedGroupIds.has(group._id);

        const addonData: AddonData[] = [];

        if (addons?.length) {
          for (const addon of addons) {
            if (addon.groupId === group._id) {
              // Check if this addon is assigned to the product
              const isAddonSelected = selectedAddonIds.has(addon._id);

              addonData.push({
                _id: addon._id,
                label: addon.label,
                price: addon.price,
                groupId: addon.groupId,
                isSelected: isAddonSelected,
              });
            }
          }
        }

        formData.push({
          _id: group._id,
          label: group.label,
          allowMulti: group.allowMulti,
          min: group.min,
          max: group.max,
          description: group.description,
          isSelected: isGroupSelected,
          addons: addonData,
        });
      }
    }

    return formData;
  }

  /**
   * Transform form data to API request format
   * Only includes pricing for selected addons
   */
  static getModifiedDataFromFormData(
    addonFormData: AddonFormData,
    pricingData: AddonPricingData[],
    productId?: string,
  ): ModifiedAddonData {
    const pricing: VariantPricingEditData[] = [];

    // Get all selected addon IDs and group IDs
    const selectedAddonIds = new Set<string>();
    const selectedGroupIds = new Set<string>();

    addonFormData?.forEach((group) => {
      if (group.isSelected) {
        selectedGroupIds.add(group._id);
      }
      group.addons?.forEach((addon) => {
        if (addon.isSelected) {
          selectedAddonIds.add(addon._id);
        }
      });
    });

    // Only include pricing for selected addons
    pricingData.forEach((pr) => {
      const isAddonType = pr.type === "addon";
      const isAddonGroupType = pr.type === "addonGroup";

      // Check if this pricing entry is for a selected addon/group
      const shouldInclude =
        (isAddonType && selectedAddonIds.has(pr.addonId || "")) ||
        (isAddonGroupType && selectedGroupIds.has(pr.addonGroupId || ""));

      if (shouldInclude) {
        pricing.push({
          _id: pr.isNew ? undefined : pr._id,
          addonGroupId: pr.type === "addonGroup" ? pr.addonGroupId : undefined,
          addonId: pr.type === "addon" ? pr.addonId : undefined,
          isVisible: pr.isVisible,
          price: pr.type !== "addonGroup" ? pr.price : undefined,
          productId,
          subVariantId: undefined,
          type: pr.type,
          variantGroupId: pr.variantGroupId,
          variantId: pr.variantId,
        });
      }
    });

    return {
      pricing,
      addonIds: Array.from(selectedAddonIds),
      addonGroupIds: Array.from(selectedGroupIds),
    };
  }

  /**
   * Extract primary variants from VariantFormData
   */
  static extractPrimaryVariants(
    variantFormData: VariantFormData | null,
  ): PrimaryVariant[] {
    if (!variantFormData?.variantGroups?.length) {
      return [];
    }

    const primaryGroup = variantFormData.variantGroups.find(
      (group) => group.isPrimary,
    );

    if (!primaryGroup?.variants?.length) {
      return [];
    }

    return primaryGroup.variants.map((variant) => ({
      _id: variant._id,
      label: variant.label,
      groupId: primaryGroup._id,
    }));
  }

  /**
   * Generate addon pricing matrix based on selected addons and variants
   * - If variants exist: create pricing for each primary variant × selected addon
   * - If no variants: create product-level pricing for each selected addon
   */
  static generateAddonPricingData(
    addonFormData: AddonFormData,
    variantFormData: VariantFormData | null,
    existingPricing: AddonPricingData[],
    productId?: string,
  ): AddonPricingData[] {
    const pricingData: AddonPricingData[] = [];

    if (!addonFormData?.length) {
      return pricingData;
    }

    // Extract primary variants
    const primaryVariants = this.extractPrimaryVariants(variantFormData);
    const hasPrimaryVariants = primaryVariants.length > 0;

    // Helper to find existing pricing entry
    const findExistingPricing = (
      type: "addon" | "addonGroup",
      id: string,
      variantId?: string,
    ): AddonPricingData | undefined => {
      return existingPricing.find((pr) => {
        const matchesType = pr.type === type;
        const matchesId =
          type === "addon" ? pr.addonId === id : pr.addonGroupId === id;
        const matchesVariant = hasPrimaryVariants
          ? pr.variantId === variantId
          : !pr.variantId;

        return matchesType && matchesId && matchesVariant;
      });
    };

    // Process each addon group
    addonFormData.forEach((group) => {
      // Only process selected groups and their addons
      if (!group.isSelected && !group.addons.some((a) => a.isSelected)) {
        return;
      }

      // Process selected addons in this group
      group.addons.forEach((addon) => {
        if (!addon.isSelected) {
          return;
        }

        if (hasPrimaryVariants) {
          // Create pricing entry for each primary variant × addon combination
          primaryVariants.forEach((variant) => {
            // Check if pricing already exists
            const existing = findExistingPricing(
              "addon",
              addon._id,
              variant._id,
            );

            if (existing) {
              // Reuse existing pricing
              pricingData.push(existing);
            } else {
              // Create new pricing entry
              pricingData.push({
                _id: uuidv4(),
                type: "addon",
                variantId: variant._id,
                variantGroupId: variant.groupId,
                addonGroupId: group._id,
                addonId: addon._id,
                productId,
                isVisible: true,
                price: addon.price,
                isNew: true,
              });
            }

            // Create addon group visibility entry (one per variant)
            const existingGroup = findExistingPricing(
              "addonGroup",
              group._id,
              variant._id,
            );

            // Only add if not already in pricingData
            if (
              existingGroup &&
              !pricingData.some((pr) => pr._id === existingGroup._id)
            ) {
              pricingData.push(existingGroup);
            } else if (
              !existingGroup &&
              !pricingData.some(
                (pr) =>
                  pr.type === "addonGroup" &&
                  pr.addonGroupId === group._id &&
                  pr.variantId === variant._id,
              )
            ) {
              pricingData.push({
                _id: uuidv4(),
                type: "addonGroup",
                variantId: variant._id,
                variantGroupId: variant.groupId,
                addonGroupId: group._id,
                productId,
                isVisible: true,
                price: 0,
                isNew: true,
              });
            }
          });
        } else {
          // No variants: create product-level pricing
          const existing = findExistingPricing("addon", addon._id);

          if (existing) {
            pricingData.push(existing);
          } else {
            pricingData.push({
              _id: uuidv4(),
              type: "addon",
              addonGroupId: group._id,
              addonId: addon._id,
              productId,
              isVisible: true,
              price: addon.price,
              isNew: true,
            });
          }

          // Create addon group entry (product-level)
          const existingGroup = findExistingPricing("addonGroup", group._id);

          if (
            existingGroup &&
            !pricingData.some((pr) => pr._id === existingGroup._id)
          ) {
            pricingData.push(existingGroup);
          } else if (
            !existingGroup &&
            !pricingData.some(
              (pr) =>
                pr.type === "addonGroup" &&
                pr.addonGroupId === group._id &&
                !pr.variantId,
            )
          ) {
            pricingData.push({
              _id: uuidv4(),
              type: "addonGroup",
              addonGroupId: group._id,
              productId,
              isVisible: true,
              price: 0,
              isNew: true,
            });
          }
        }
      });
    });

    return pricingData;
  }

  /**
   * Transform API pricing response to form pricing data
   * Only includes addon-related pricing
   */
  static getPricingFormData(
    pricing: VariantPricingResponse[],
    productId?: string,
  ): AddonPricingData[] {
    return pricing
      .filter((pr) => pr.type === "addon" || pr.type === "addonGroup")
      .map<AddonPricingData>((pr) => ({
        _id: pr._id,
        isNew: false,
        isVisible: pr.isVisible,
        price: pr.price,
        type: pr.type as "addon" | "addonGroup",
        variantGroupId: pr.variantGroupId,
        variantId: pr.variantId,
        addonGroupId: pr.addonGroupId,
        addonId: pr.addonId,
        productId: pr.productId || productId,
      }));
  }
}
