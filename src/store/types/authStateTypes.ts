import type { StaffResponse } from "@/types/user.types";
import type { StoreFetchingOrActionStatus } from "./commonStateTypes";

export type AuthState = {
  user: StaffResponse;
  isLoggedIn: boolean;
  status: StoreFetchingOrActionStatus;
  errorMessage: string;
};
