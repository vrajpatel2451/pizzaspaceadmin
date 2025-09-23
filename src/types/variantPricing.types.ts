export type VariantPricingType = "addonGroup" | "addon" | "variant";

export interface VariantPricingResponse {
  _id: string;

  type: VariantPricingType;
  variantId: string;
  variantGroupId: string;
  subVariantId: string;
  addonGroupId: string;
  addonId: string;
  productId: string;
  isVisible: boolean;
  price: number;

  createdAt: string;
  updatedAt: string;
}

export type VariantPricingCreateData = Pick<
  VariantPricingResponse,
  | "type"
  | "variantId"
  | "variantGroupId"
  | "subVariantId"
  | "addonGroupId"
  | "addonId"
  | "productId"
  | "isVisible"
  | "price"
>;
export type VariantPricingEditData = Pick<
  VariantPricingResponse,
  | "type"
  | "variantId"
  | "variantGroupId"
  | "subVariantId"
  | "addonGroupId"
  | "addonId"
  | "productId"
  | "isVisible"
  | "price"
> & {
  _id?: string;
};
