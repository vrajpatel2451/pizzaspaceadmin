export type NotificationChannel =
  | "ORDER_CREATED"
  | "ORDER_PAYMENT_CONFIRMED"
  | "ORDER_REVIEW_CREATED"
  | "ORDER_ITEM_REVIEW_CREATED"
  | "ORDER_TICKET_CREATED"
  | "GENERAL_RATING_CREATED"
  | "CONTACT_QUERY_CREATED"
  | "RESERVATION_CREATED"
  | "TEST_NOTIFICATION"
  | "GENERAL";

export type SocketNotificationPayload = {
  title: string;
  body: string;
  category: NotificationChannel;
  data: Record<string, string>;
  timestamp: string;
};

export const NOTIFICATION_CHANNELS: NotificationChannel[] = [
  "ORDER_CREATED",
  "ORDER_PAYMENT_CONFIRMED",
  "ORDER_REVIEW_CREATED",
  "ORDER_ITEM_REVIEW_CREATED",
  "ORDER_TICKET_CREATED",
  "GENERAL_RATING_CREATED",
  "CONTACT_QUERY_CREATED",
  "RESERVATION_CREATED",
  "TEST_NOTIFICATION",
  "GENERAL",
];
