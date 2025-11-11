import type { OrderDeliveryType } from "./cart.types";
import type { CustomerBillingOnCart } from "./pricing.types";

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

// Addon Item
export type AdminTransformedAddonItem = {
  name: string;
  quantity: number;
};

// Order Item
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

// Admin Billing
export type AdminBilling = {
  customerTotal: CustomerBillingOnCart;
};

// Full Order Response (to be used when fetching orders later)
export type AdminTransformedOrder = {
  _id: string;
  status: OrderStatus;
  statusList: OrderStatusAndTimeResponse[];
  createdDate: Date;
  updatedDate: Date;
  customerMessage: string;
  items: AdminTransformedOrderItem[];
  seller: {
    info: {
      _id: string;
      name: string;
      imageUrl: string;
      phone: string;
      email: string;
      deliveryRadius: number;
      lat: number;
      long: number;
      line1: string;
      line2: string;
      area: string;
      city: string;
      county: string;
      country: string;
      zip: string;
      isActive: boolean;
      createdAt: string;
    };
  };
  customer: {
    info: {
      _id: string;
      name: string;
      email: string;
      phone: string;
      isActive: boolean;
      lastLogin?: Date;
      createdAt: Date;
      updatedAt: Date;
    };
    address: {
      _id: string;
      name: string;
      phone: string;
      line1: string;
      line2: string;
      area: string;
      county: string;
      country: string;
      zip: string;
      userId: string;
      lat: number;
      long: number;
      type: "home" | "work" | "other";
      otherAddressLabel: string;
      isDefault: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
  };
  rider: {
    info: {
      _id: string;
      name: string;
      email: string;
      role: "manager" | "admin" | "delivery_boy" | "kitchen";
      storeId?: string;
      isActive: boolean;
      lastLogin?: Date;
      createdAt: Date;
      updatedAt: Date;
    };
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
