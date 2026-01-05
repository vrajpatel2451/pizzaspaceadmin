import { v4 as uuidv4 } from "uuid";
import type {
  ComboFormData,
  ComboGroupEditData,
  ComboGroupFormData,
  ComboGroupProductFormData,
  ComboGroupProductResponse,
  ComboGroupResponse,
} from "@/types/product.types";

export type ModifiedComboData = {
  comboGroups: ComboGroupEditData[];
  deletedComboGroupIds: string[];
};

export class ComboUtils {
  /**
   * Transform API response to form data structure
   */
  static getFormDataFromResponse(
    comboGroups: ComboGroupResponse[],
    comboGroupProducts: ComboGroupProductResponse[],
    productLookup?: Map<
      string,
      {
        name: string;
        photo?: string;
        category?: string;
        variants?: { _id: string; label: string }[];
      }
    >,
  ): ComboFormData {
    if (!comboGroups?.length) return [];

    return comboGroups.map((group) => {
      // Find products that belong to this group
      const groupProducts =
        comboGroupProducts?.filter((cgp) => cgp.comboGroupId === group._id) ||
        [];

      const products: ComboGroupProductFormData[] = groupProducts.map((cgp) => {
        const productInfo = productLookup?.get(cgp.productId);
        const defaultVariant = productInfo?.variants?.find(
          (v) => v._id === cgp.defaultVariantId,
        );

        return {
          productId: cgp.productId,
          productName: productInfo?.name || "Unknown Product",
          productPhoto: productInfo?.photo,
          category: productInfo?.category,
          defaultVariantId: cgp.defaultVariantId,
          defaultVariantLabel: defaultVariant?.label,
          availableVariants: productInfo?.variants,
          _id: cgp._id,
        };
      });

      return {
        _id: group._id,
        groupId: group.groupId,
        label: group.label,
        description: group.description,
        minSelection: group.minSelection,
        maxSelection: group.maxSelection,
        allowCustomization: group.allowCustomization,
        products,
        storeIds: group.storeIds || [],
        isNew: false,
      };
    });
  }

  /**
   * Transform form data to API request format
   */
  static getModifiedDataFromFormData(
    comboFormData: ComboFormData,
    deletedComboGroupIds: string[],
  ): ModifiedComboData {
    const comboGroups: ComboGroupEditData[] = comboFormData.map((group) => ({
      _id: group.isNew ? undefined : group._id,
      groupId: group.groupId,
      label: group.label,
      description: group.description,
      minSelection: group.minSelection,
      maxSelection: group.maxSelection,
      allowCustomization: group.allowCustomization,
      products: group.products.map((product) => ({
        productId: product.productId,
        defaultVariantId: product.defaultVariantId,
        _id: product._id,
      })),
      storeIds: group.storeIds,
      isNew: group.isNew,
    }));

    return {
      comboGroups,
      deletedComboGroupIds,
    };
  }

  /**
   * Create a new empty combo group
   */
  static createEmptyGroup(): ComboGroupFormData {
    const id = uuidv4();
    return {
      _id: id,
      groupId: id,
      label: "",
      description: "",
      minSelection: 1,
      maxSelection: 1,
      allowCustomization: false,
      products: [],
      storeIds: [],
      isNew: true,
    };
  }

  /**
   * Clone an existing combo group
   */
  static cloneGroup(group: ComboGroupFormData): ComboGroupFormData {
    const id = uuidv4();
    return {
      ...group,
      _id: id,
      groupId: id,
      label: `${group.label} (Copy)`,
      products: group.products.map((p) => ({
        ...p,
        _id: undefined as any, // Remove _id so backend creates new entries
      })),
      storeIds: [...group.storeIds],
      isNew: true,
    };
  }

  /**
   * Validate combo groups before save
   */
  static validateComboGroups(comboFormData: ComboFormData): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!comboFormData.length) {
      errors.push("At least one selection group is required");
      return { isValid: false, errors };
    }

    comboFormData.forEach((group, index) => {
      if (!group.label.trim()) {
        errors.push(`Group ${index + 1}: Label is required`);
      }
      if (group.products.length === 0) {
        errors.push(`Group ${index + 1}: At least one product is required`);
      }
      if (group.minSelection < 1) {
        errors.push(`Group ${index + 1}: Minimum selection must be at least 1`);
      }
      if (group.maxSelection < group.minSelection) {
        errors.push(
          `Group ${index + 1}: Maximum selection must be greater than or equal to minimum`,
        );
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
