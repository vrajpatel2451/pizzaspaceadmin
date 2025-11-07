import type { AddonGroupResponse, AddonResponse } from "./addon.types";
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
  | "variants"
  | "addons"
  | "tags"
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
  | "category"
  | "subCategory"
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
};

export type ProductDetailsResponse = {
  product: ProductResponse;
  variantList: VariantResponse[];
  variantGroupList: VariantGroupResponse[];
  addonList: AddonResponse[];
  addonGroupList: AddonGroupResponse[];
  pricing: VariantPricingResponse[];
};
