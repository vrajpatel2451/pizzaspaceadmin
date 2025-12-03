// Contact Query Types

export type ContactQuerySubject =
  | "general inquiry"
  | "order issue"
  | "feedback"
  | "other"
  | "reservation"
  | "general complaint";

export type ContactQueryStatus = "open" | "closed";

export interface ContactQueryResponse {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: ContactQuerySubject;
  message: string;
  status: ContactQueryStatus;
  closingMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactQueryCreateData {
  name: string;
  email: string;
  phone?: string;
  subject: ContactQuerySubject;
  message: string;
}

export interface ContactQueryUpdateData {
  name?: string;
  email?: string;
  phone?: string;
  subject?: ContactQuerySubject;
  message?: string;
  status?: ContactQueryStatus;
  closingMessage?: string;
}

export interface ContactQueryQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  isAscending?: boolean;
  status?: ContactQueryStatus;
}
