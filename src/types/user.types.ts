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

// Customer User Types
export type UserAddressType = "home" | "work" | "other";

export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AddressResponse {
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
  type: UserAddressType;
  otherAddressLabel: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateUserData {
  name: string;
  email: string;
  phone: string;
}

export interface UpdateUserData {
  name: string;
  email: string;
  phone: string;
  isActive?: boolean;
}

export interface CreateAddressData {
  name: string;
  phone: string;
  line1: string;
  line2: string;
  area: string;
  county: string;
  country: string;
  zip: string;
  lat: number;
  long: number;
  type: UserAddressType;
  otherAddressLabel?: string;
  isDefault: boolean;
}
