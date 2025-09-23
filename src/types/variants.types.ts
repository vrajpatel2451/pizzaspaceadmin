export interface VariantResponse {
  _id: string;
  // basic info
  label: string;
  price: string;
  groupId: string;
  itemId: string;
  isPrimary: boolean;

  storeIds: string[];

  createdAt: string;
  updatedAt: string;
  uiKey: string;
}

export interface VariantGroupResponse {
  _id: string;
  // basic info
  label: string;
  description: string;
  isPrimary: boolean;
  itemId: string;
  uiKey: string;

  storeIds: string[];

  createdAt: string;
  updatedAt: string;
}

export type VariantCreateData = Pick<
  VariantResponse,
  "label" | "price" | "groupId" | "isPrimary" | "itemId"
>;
export type VariantEditData = Pick<
  VariantResponse,
  "label" | "price" | "groupId" | "storeIds" | "isPrimary" | "itemId"
>;

export type VariantGroupCreateData = Pick<
  VariantGroupResponse,
  "label" | "description" | "isPrimary" | "itemId"
>;
export type VariantGroupEditData = Pick<
  VariantGroupResponse,
  "label" | "description" | "storeIds" | "isPrimary" | "itemId"
>;

export type VariantQueryParams = {
  search?: string;
  groupId?: string;
};
