export type DeliveryChargesUnit = "km" | "mile" | "m";

export type DeliveryChargesResponse = {
  _id: string;
  deliveryChargesAmount: number;
  deliveryChargesUnit: DeliveryChargesUnit;
  storeId: string;
  uiKey?: string;
  createdAt: string;
  updatedAt: string;
};

export type DeliveryChargesCreateData = {
  deliveryChargesAmount: number;
  deliveryChargesUnit: DeliveryChargesUnit;
  storeId: string;
};
export type DeliveryChargesUpdateData = {
  deliveryChargesAmount: number;
  deliveryChargesUnit: DeliveryChargesUnit;
  storeId: string;
};

export interface DeliveryChargesQueryParams {
  page?: number;
  limit?: number;
  deliveryChargesUnit?: DeliveryChargesUnit;
  storeId?: string;
  all?: boolean;
}
