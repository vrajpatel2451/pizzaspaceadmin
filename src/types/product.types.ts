import type { AddonGroupResponse, AddonResponse } from "./addon.types";
import type { OrderDeliveryType } from "./cart.types";
import type {
  VariantPricingEditData,
  VariantPricingResponse,
} from "./variantPricing.types";
import type {
  VariantEditData,
  VariantGroupEditData,
  VariantGroupResponse,
  VariantResponse,
} from "./variants.types";

export type ProductType = "veg" | "non_veg" | "vegan";

export type SpiceLevel = "0_chilli" | "1_chilli" | "2_chilli";

export type Ingredient = {
  name: string;
  count: number; // in grams
};

export enum DishSizeUnit {
  // Piece based
  piece = "piece",
  pieces = "pieces",
  slice = "slice",
  slices = "slices",
  pack = "pack",
  bucket = "bucket",
  platter = "platter",

  // Weight based
  gram = "gram",
  kilograms = "kilograms",
  mg = "mg",
  pound = "pound",
  ounce = "ounce",

  // Volume based (for soups, drinks, etc.)
  ml = "ml",
  liter = "liter",
  cup = "cup",
  pint = "pint",
  quart = "quart",
  gallon = "gallon",

  // Count based (like sushi rolls, wings, dumplings)
  dozen = "dozen",
  half_dozen = "half_dozen",
}

export type DishSize = {
  count: number;
  unit: DishSizeUnit;
};

export interface ProductResponse {
  _id: string;
  // basic info
  name: string;
  description: string;
  type: ProductType;
  photoList: string[];
  category: string;
  subCategory: string;
  availableDeliveryTypes: OrderDeliveryType[];
  // serving info
  noOfPeople: number;
  dishSize: DishSize;

  // pricing
  basePrice: number;
  packagingCharges: number;

  // variants and addons
  variantGroups: string[];
  addonGroups: string[];
  variants: string[];
  addons: string[];
  isCombo: boolean;

  // additional info
  tags: string[];
  spiceLevel: SpiceLevel[];
  frosting: string;

  // nutritional info
  weight: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;

  allergicInfo: string[];
  ingredientList: Ingredient[];

  storeIds: string[];

  createdAt: string;
  updatedAt: string;
}

export type ProductCreateData = Pick<
  ProductResponse,
  | "name"
  | "description"
  | "type"
  | "photoList"
  | "category"
  | "variantGroups"
  | "addonGroups"
  | "subCategory"
  | "noOfPeople"
  | "dishSize"
  | "basePrice"
  | "packagingCharges"
  | "availableDeliveryTypes"
  | "variants"
  | "addons"
  | "tags"
  | "isCombo"
  | "spiceLevel"
  | "frosting"
  | "weight"
  | "protein"
  | "carbs"
  | "fats"
  | "fiber"
  | "allergicInfo"
  | "ingredientList"
>;

export type ProductUpdateData = Pick<
  ProductResponse,
  | "name"
  | "description"
  | "type"
  | "photoList"
  | "isCombo"
  | "category"
  | "subCategory"
  | "availableDeliveryTypes"
  | "noOfPeople"
  | "dishSize"
  | "basePrice"
  | "packagingCharges"
  | "variants"
  | "addons"
  | "tags"
  | "spiceLevel"
  | "frosting"
  | "weight"
  | "protein"
  | "variantGroups"
  | "addonGroups"
  | "carbs"
  | "fats"
  | "fiber"
  | "allergicInfo"
  | "ingredientList"
  | "storeIds"
>;

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  storeId?: string;
  categoryId?: string;
  ids?: string[];
  all?: boolean;
  subCategoryId?: string;
}

export type ProductAddEditData = {
  product: ProductCreateData;
  variantGroups: VariantGroupEditData[];
  variants: VariantEditData[];
  pricing: VariantPricingEditData[];
  deletedGroupIds?: string[];
  deletedIds?: string[];
  // combo fields
  comboGroups?: ComboGroupEditData[];
  deletedComboGroupIds?: string[];
};

// Type for combo group products in the request
export type ComboGroupProductEditData = {
  productId: string;
  defaultVariantId?: string;
  _id?: string;
};

export interface ComboGroupResponse {
  _id: string;
  groupId: string; // UUID from frontend
  comboId: string; // reference to combo Product
  label: string;
  description: string;
  minSelection: number;
  maxSelection: number;
  allowCustomization: boolean;
  storeIds: string[];
  createdAt: string;
  updatedAt: string;
}

// ComboGroupProduct - links selectable products to a combo group
export interface ComboGroupProductResponse {
  _id: string;
  comboGroupId: string; // reference to ComboGroup
  productId: string; // selectable product
  defaultVariantId?: string; // pre-selected variant (e.g., "9 inch")
  storeIds: string[];
  createdAt: string;
  updatedAt: string;
}

// Type for combo groups in the request
export type ComboGroupEditData = {
  _id?: string;
  groupId: string;
  label: string;
  description: string;
  minSelection: number;
  maxSelection: number;
  allowCustomization: boolean;
  products: ComboGroupProductEditData[];
  storeIds?: string[];
  isNew?: boolean;
};

export type ProductDetailsResponse = {
  product: ProductResponse;
  variantList: VariantResponse[];
  variantGroupList: VariantGroupResponse[];
  addonList: AddonResponse[];
  addonGroupList: AddonGroupResponse[];
  pricing: VariantPricingResponse[];
  // combo data (only populated if product.isCombo is true)
  comboGroups?: ComboGroupResponse[];
  comboGroupProducts?: ComboGroupProductResponse[];
};

export interface ComboProductSearchParams {
  search?: string;
  limit?: number;
  storeId?: string;
  productIds?: string[];
  categoryId?: string;
  subCategoryId?: string;
  page?: number;
  all?: boolean;
}
export interface ComboProductSearchItem {
  _id: string;
  name: string;
  photoList: string[];
  category: string;
  subCategory: string;
  primaryVariants?: VariantResponse[];
}

// Form data types for combo groups (used in UI state management)
export interface ComboGroupProductFormData {
  productId: string;
  productName: string;
  productPhoto?: string;
  category?: string;
  defaultVariantId?: string;
  defaultVariantLabel?: string;
  availableVariants?: { _id: string; label: string }[];
  _id?: string;
}

export interface ComboGroupFormData {
  _id: string;
  groupId: string;
  label: string;
  description: string;
  minSelection: number;
  maxSelection: number;
  allowCustomization: boolean;
  products: ComboGroupProductFormData[];
  isNew: boolean;
}

export type ComboFormData = ComboGroupFormData[];
