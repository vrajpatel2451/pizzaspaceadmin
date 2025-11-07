export type TaxSection = "itemTotal" | "deliveryCharges" | "packingCharges";

export type OrderTaxStructureResponse = {
  _id: string;
  tax: number;
  allowTax: boolean;
  afterDiscount: boolean;
  section: TaxSection;
  uiKey?: string;
  storeId: string;
  createdAt: string;
  updatedAt: string;
};

export type OrderTaxStructureCreateData = {
  tax: number;
  allowTax: boolean;
  afterDiscount: boolean;
  section: TaxSection;
  storeId: string;
};
export type OrderTaxStructureUpdateData = {
  tax: number;
  allowTax: boolean;
  afterDiscount: boolean;
  section: TaxSection;
  storeId: string;
};

export interface OrderTaxStructureQueryParams {
  page?: number;
  limit?: number;
  section?: TaxSection;
  storeId?: string;
  all?: boolean;
}
