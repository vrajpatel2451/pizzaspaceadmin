export type ExtraChargesResponse = {
  _id: string;
  name: string;
  price: number;
  discount: number;
  tax: number;
  allowTax: boolean;
  taxAfterDiscount: boolean;
  storeId: string;
  createdAt: string;
  uiKey?: string;
  updatedAt: string;
};

export type ExtraChargesCreateData = {
  name: string;
  price: number;
  discount: number;
  tax: number;
  allowTax: boolean;
  taxAfterDiscount: boolean;
  storeId: string;
};
export type ExtraChargesUpdateData = {
  name: string;
  price: number;
  discount: number;
  tax: number;
  allowTax: boolean;
  taxAfterDiscount: boolean;
  storeId: string;
};

export interface ExtraChargesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  storeId?: string;
  all?: boolean;
}
