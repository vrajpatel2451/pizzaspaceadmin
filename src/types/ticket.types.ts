export type OrderTicketStatus = "open" | "closed";

export interface OrderTicketResponse {
  _id: string;
  orderId: string;
  userId: string;
  storeId: string;
  message: string;
  imageList: string[];
  status: OrderTicketStatus;
  closingMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderTicketQueryParams {
  currentPage?: number;
  limit?: number;
  orderId?: string;
  status?: OrderTicketStatus;
  userId?: string;
  storeId?: string;
}

export interface ChangeTicketStatusData {
  status: OrderTicketStatus;
}

export interface UpdateClosingMessageData {
  closingMessage: string;
}

export interface EnrichedOrderTicket extends OrderTicketResponse {
  user?: { name: string; email: string; phone: string };
  store?: { name: string };
}
