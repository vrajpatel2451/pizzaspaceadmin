export type StaffRole = "manager" | "admin" | "delivery_boy" | "kitchen";

export interface StaffRegistrationData {
  name: string;
  email: string;
  password: string;
  apiKey?: string;
  role: StaffRole;
  storeId?: string;
}

export interface StaffLoginData {
  email: string;
  password: string;
}

export interface StaffQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: StaffRole;
  storeId?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface StaffResponse {
  _id: string;
  name: string;
  email: string;
  role: StaffRole;
  storeId?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type StaffResponseWithToken = {
  staff: StaffResponse;
  tokens: AuthTokenResponse;
};

export type StaffChangePassword = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};
export type StaffUpdateRequest = {
  name: string;
  email: string;
  role: StaffRole;
  storeId: string;
  isActive: string;
};

export type AuthTokenResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
};
