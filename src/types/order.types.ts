import type { StoreResponse } from "@/features/company-management/types/StoreTypes";
import type { OrderDeliveryType } from "./cart.types";
import type { CustomerBillingOnCart } from "./pricing.types";
import type {
  AddressResponse,
  StaffResponse,
  UserResponse,
} from "./user.types";

// Re-export existing types for convenience
export type { OrderDeliveryType };

// Enums as union types
export type OrderItemStatus = "ordered" | "cancelled" | "returned";

export type OrderStatus =
  | "initiated"
  | "payment_confirmed"
  | "payment_error"
  | "cancelled"
  | "preparing"
  | "ready_to_pickup"
  | "on_the_way"
  | "delivered";

export type PaymentType = "cash" | "online";

// Order Status and Time
export type OrderStatusAndTimeResponse = {
  createdAt: string;
  status: OrderStatus;
};

// Discount Response
export type OrderDiscountResponse = {
  _id: string;
  name: string;
  couponCode: string;
  discountAmount: number;
  discountAmountType: "fix" | "percentage";
};

export type AdminBilling = {
  customerTotal: CustomerBillingOnCart;
};

export type AdminTransformedAddonItem = {
  name: string;
  quantity: number;
};

export type AdminTransformedOrderItem = {
  name: string;
  price: number;
  priceAfterDiscount: number;
  quantity: number;
  isRefunded: boolean;
  itemStatus: OrderItemStatus;
  refundedAt: Date;
  refundAmount: number;
  refundInitiatedAt: Date;
  refundQuantity: number;
  refundMessage: string;
  itemId: string;
  discount: OrderDiscountResponse;
  packingDiscount: OrderDiscountResponse;
  addons: AdminTransformedAddonItem[];
  variants: string[];
};

// Refund Item Data for API
export type RefundItemData = {
  itemId: string;
  refundQuantity: number;
  refundAmount: number;
  refundMessage: string;
};

// export
export type AdminTransformedOrder = {
  _id: string;
  status: OrderStatus;
  statusList: OrderStatusAndTimeResponse[];
  createdDate: Date;
  updatedDate: Date;
  customerMessage: string;
  items: AdminTransformedOrderItem[];
  seller: {
    info: StoreResponse;
  };
  customer: {
    info: UserResponse;
    address: AddressResponse;
  };
  rider: {
    info: StaffResponse;
  };
  payment: {
    method: PaymentType;
    refId: string;
  };
  billing: AdminBilling;
  staffId: string;
};

// Checkout API Request
export interface CheckoutRequest {
  userId: string;
  cartIds: string[];
  discountIds: string[];
  addressId?: string;
  paymentType: PaymentType;
  deliveryType: OrderDeliveryType;
  storeId: string;
  customerMessage?: string;
}

// Checkout API Response
export interface CheckoutResponse {
  order: AdminTransformedOrder;
  openPaymentLink: boolean;
  paymentUrl: string;
}

// Order Query Parameters for fetching orders
export interface OrderQueryParams {
  page?: number;
  limit?: number;
  search?: string; // search on orderId (_id)
  startTime?: string; // ISO date string
  endTime?: string; // ISO date string
  status?: OrderStatus;
  storeId?: string;
  customerId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
