export interface BaseApiResponse<T> {
  success: boolean;
  data: T;
  errorMessage?: string;
}
export interface ServerApiResponse<T> {
  statusCode: number;
  data: T;
  errorMessage?: string;
}

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};

export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalRows: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  currentRows: number;
}

export interface BaseApiErrorResponse {
  error?: string;
  message?: string | string[];
  statusCode?: number;
}
