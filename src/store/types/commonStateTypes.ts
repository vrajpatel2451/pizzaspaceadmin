export type StoreFetchingOrActionStatus =
  | "initial"
  | "loading"
  | "error"
  | "success";

export type ErrorState = {
  message?: string;
};
