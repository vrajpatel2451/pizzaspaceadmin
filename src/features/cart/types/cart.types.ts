import type { PricingIdsAndQuantity } from "@/types/cart.types";

export type OnAddToCart = (
  itemId: string,
  quantity: number,
  selectedVariantId: string,
  selectedPricingIds: PricingIdsAndQuantity[],
) => Promise<boolean>;
export type OnEditToCart = (
  cartId: string,
  itemId: string,
  quantity: number,
  selectedVariantId?: string,
  selectedPricingIds?: PricingIdsAndQuantity[],
) => Promise<boolean>;

export type PricingTransformation = {
  id: string;
  quantity: number;
  amount: number;
};
