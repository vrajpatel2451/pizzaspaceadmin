export interface VariantResponse {
  _id: string;
  // basic info
  label: string;
  price: string;
  groupId: string;

  storeIds: string[];

  createdAt: string;
  updatedAt: string;
}

export interface VariantGroupResponse {
  _id: string;
  // basic info
  label: string;
  description: string;

  storeIds: string[];

  createdAt: string;
  updatedAt: string;
}

export type VariantCreateData = Pick<
  VariantResponse,
  "label" | "price" | "groupId"
>;
export type VariantEditData = Pick<
  VariantResponse,
  "label" | "price" | "groupId" | "storeIds"
>;

export type VariantGroupCreateData = Pick<
  VariantGroupResponse,
  "label" | "description"
>;
export type VariantGroupEditData = Pick<
  VariantGroupResponse,
  "label" | "description" | "storeIds"
>;

export type VariantQueryParams = {
  search?: string;
  groupId?: string;
};
