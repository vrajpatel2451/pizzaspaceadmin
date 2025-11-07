export type AmountType = "fix" | "percentage";
export type DiscountConditionType =
  | "allProducts"
  | "selectedCategories"
  | "selectedProducts";
export type DiscountUserType = "allCustomers" | "newCustomers";
export type DiscountType = "normal" | "packaging" | "deliveryCharges";

export type DiscountResponse = {
  _id: string;
  name: string;
  description: string;
  couponCode: string;
  hideFromSuggestion: boolean;
  discountAmount: number;
  discountAmountType: AmountType;
  maximumAmount: number;
  conditionType: DiscountConditionType;
  referenceIds: string[];
  storeId: string;
  startTime: string;
  endTime: string;
  customerType: DiscountUserType;
  discountType: DiscountType;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type DiscountCreateData = {
  name: string;
  hideFromSuggestion: boolean;
  description: string;
  couponCode: string;
  discountAmount: number;
  discountAmountType: AmountType;
  maximumAmount: number;
  conditionType: DiscountConditionType;
  referenceIds: string[];
  storeId: string;
  startTime: string;
  endTime: string;
  customerType: DiscountUserType;
  discountType: DiscountType;
  active: boolean;
};

export type DiscountUpdateData = {
  name?: string;
  hideFromSuggestion?: boolean;
  description?: string;
  couponCode?: string;
  discountAmount?: number;
  discountAmountType?: AmountType;
  maximumAmount?: number;
  conditionType?: DiscountConditionType;
  referenceIds?: string[];
  storeId?: string;
  startTime?: string;
  endTime?: string;
  customerType?: DiscountUserType;
  discountType?: DiscountType;
  active?: boolean;
};

export interface DiscountQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  storeId?: string;
  active?: boolean;
  discountType?: DiscountType;
  customerType?: DiscountUserType;
  conditionType?: DiscountConditionType;
  discountAmountType?: AmountType;
  all?: boolean;
}
