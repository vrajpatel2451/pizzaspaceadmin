// Contact Info Types

export interface ContactInfoResponse {
  _id: string;
  addressLine1: string;
  addressLine2?: string;
  area: string;
  city: string;
  county?: string;
  zip: string;
  phone: string;
  email: string;
  lat?: number;
  lng?: number;
  immediatePhoneNo?: string;
  immediateEmail?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactInfoCreateData {
  addressLine1: string;
  addressLine2?: string;
  area: string;
  city: string;
  county?: string;
  zip: string;
  phone: string;
  email: string;
  lat?: number;
  lng?: number;
  immediatePhoneNo?: string;
  immediateEmail?: string;
  isPublished?: boolean;
}

export interface ContactInfoUpdateData {
  addressLine1?: string;
  addressLine2?: string;
  area?: string;
  city?: string;
  county?: string;
  zip?: string;
  phone?: string;
  email?: string;
  lat?: number;
  lng?: number;
  immediatePhoneNo?: string;
  immediateEmail?: string;
  isPublished?: boolean;
}

export interface ContactInfoQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  isAscending?: boolean;
  isPublished?: boolean;
}
