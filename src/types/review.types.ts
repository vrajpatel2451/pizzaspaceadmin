// Order Review types
export interface OrderReviewResponse {
  _id: string;
  orderId: string;
  userId: string;
  storeId: string;
  staffId?: string;
  overallRatings: number;
  overallMessage?: string;
  deliveryBoyRatings?: number;
  deliveryBoyMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderReviewQueryParams {
  currentPage?: number;
  limit?: number;
  orderId?: string;
  overallRatings?: number;
  deliveryBoyRatings?: number;
  userId?: string;
  storeId?: string;
  staffId?: string;
}

// Order Item Review types
export interface OrderItemReviewResponse {
  _id: string;
  orderId: string;
  itemId: string;
  userId: string;
  storeId: string;
  ratings: number;
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemReviewQueryParams {
  currentPage?: number;
  limit?: number;
  orderId?: string;
  ratings?: number;
  userId?: string;
  storeId?: string;
  itemId?: string;
}

// Enriched types with user/store/staff details
export interface EnrichedOrderReview extends OrderReviewResponse {
  user?: { name: string; email: string; phone: string };
  store?: { name: string };
  staff?: { name: string };
}

export interface EnrichedOrderItemReview extends OrderItemReviewResponse {
  user?: { name: string; email: string; phone: string };
  store?: { name: string };
  item?: { name: string };
}
