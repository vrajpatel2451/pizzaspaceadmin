export type NotificationCategory =
  | "ORDER_CREATED"
  | "ORDER_PAYMENT_CONFIRMED"
  | "ORDER_REVIEW_CREATED"
  | "ORDER_ITEM_REVIEW_CREATED"
  | "GENERAL_RATING_CREATED"
  | "ORDER_TICKET_CREATED"
  | "CONTACT_QUERY_CREATED"
  | "RESERVATION_CREATED";

export const CATEGORY_TO_ROUTE: Record<NotificationCategory, string> = {
  ORDER_CREATED: "/recent-orders",
  ORDER_PAYMENT_CONFIRMED: "/recent-orders",
  ORDER_REVIEW_CREATED: "/order-reviews",
  ORDER_ITEM_REVIEW_CREATED: "/order-reviews",
  GENERAL_RATING_CREATED: "/website/general-ratings",
  ORDER_TICKET_CREATED: "/order-tickets",
  CONTACT_QUERY_CREATED: "/customers/contact-queries",
  RESERVATION_CREATED: "/customers/reservation-queries",
};

export type ScreenRefetchCallback = () => void;

export interface ScreenRegistration {
  route: string;
  categories: NotificationCategory[];
  onReset: ScreenRefetchCallback;
}

export interface FCMNotificationPayload {
  notification?: {
    title?: string;
    body?: string;
  };
  data?: {
    category?: NotificationCategory;
    [key: string]: string | undefined;
  };
}
