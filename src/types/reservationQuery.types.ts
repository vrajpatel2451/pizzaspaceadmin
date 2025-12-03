// Reservation Query Types

export type ReservationStatus = "open" | "cancelled" | "reserved";

export interface ReservationQueryResponse {
  _id: string;
  storeId: string;
  date: string;
  time: string;
  noOfGuest: number;
  name: string;
  phone: string;
  message?: string;
  status: ReservationStatus;
  closingMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReservationQueryCreateData {
  storeId: string;
  date: string;
  time: string;
  noOfGuest: number;
  name: string;
  phone: string;
  message?: string;
}

export interface ReservationQueryUpdateData {
  storeId?: string;
  date?: string;
  time?: string;
  noOfGuest?: number;
  name?: string;
  phone?: string;
  message?: string;
  status?: ReservationStatus;
  closingMessage?: string;
}

export interface ReservationQueryQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  isAscending?: boolean;
  status?: ReservationStatus;
}
