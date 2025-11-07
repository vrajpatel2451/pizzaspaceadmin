export type CustomerAppliedTaxOnCart = {
  itemTotal: number;
  packing: number;
  deliveryCharges: number;
  extraCharges: Record<string, number>;
  total: number;
};

export type CustomerBillingOnCart = {
  itemTotal: number;
  itemTotalAfterDiscount: number;
  packingCharges: number;
  packingChargesAfterDiscount: number;
  deliveryCharges: number;
  deliveryChargesAfterDiscount: number;
  extraCharges: Record<string, [number, number]>;
  tax: CustomerAppliedTaxOnCart;
  totalDiscount: number;
  total: number;
};

export type CustomerExtraChargesCalculation = {
  extraCharges: Record<string, [number, number]>;
  taxOnExtraCharges: Record<string, number>;
};

export type PricingForCartParamsForAdmin = {
  cartIds: string[];
  discountIds: string[];
  storeId: string;
  addressId: string;
};
