export type StoreResponse = {
  _id: string;
  name: string;
  imageUrl: string;
  // contact
  phone: string;
  email: string;
  // address
  deliveryRadius: number; // in miles
  lat: number;
  long: number;
  line1: string;
  line2: string;
  area: string;
  city: string;
  county: string;
  country: string;
  zip: string;
  isActive: boolean;
  createdAt: string;
};

export type StoreCreateData = Pick<
  StoreResponse,
  | "name"
  | "imageUrl"
  | "phone"
  | "email"
  | "lat"
  | "long"
  | "line1"
  | "line2"
  | "area"
  | "city"
  | "deliveryRadius"
  | "country"
  | "county"
  | "zip"
>;
export type StoreUpdateData = Pick<
  StoreResponse,
  | "name"
  | "imageUrl"
  | "phone"
  | "email"
  | "lat"
  | "long"
  | "line1"
  | "line2"
  | "deliveryRadius"
  | "area"
  | "city"
  | "country"
  | "county"
  | "zip"
  | "isActive"
>;

export interface StoreQueryParams {
  page?: number;
  limit?: number;
  lat?: number;
  long?: number;
  search?: string;
  isActive?: boolean;
}
