export type PricingIdsAndQuantity = {
  id: string;
  quantity: number;
};

export type CartResponse = {
  _id: string;
  itemId: string;
  quantity: number;
  variantId: string;
  categoryId: string;
  sessionId: string;
  pricing: PricingIdsAndQuantity[];
  storeId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};
export type CartCreateData = {
  itemId: string;
  quantity: number;
  variantId: string;
  sessionId: string;
  categoryId: string;
  userId?: string;
  pricing: PricingIdsAndQuantity[];
  storeId: string;
  fromWeb: boolean;
};
export type CartUpdateData = {
  itemId?: string;
  quantity?: number;
  categoryId?: string;
  variantId?: string;
  pricing?: PricingIdsAndQuantity[];
};

export interface CartQueryParams {
  page?: number;
  limit?: number;
  all?: boolean;
  categoryId?: string;
  userId?: string;
  storeId?: string;
  fromWeb?: boolean;
  sessionId?: string;
}
