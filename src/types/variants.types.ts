export type VariantAddonSelectionType = "none" | "overall" | "perGroup";
export interface VariantResponse {
  _id: string;
  // basic info
  label: string;
  price: number;
  groupId: string;
  itemId: string;
  isPrimary: boolean;
  maxItems: number;
  maxItemTypes: VariantAddonSelectionType;
  packagingCharges: number;

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
  | "label"
  | "price"
  | "groupId"
  | "isPrimary"
  | "itemId"
  | "storeIds"
  | "_id"
  | "maxItemTypes"
  | "maxItems"
  | "packagingCharges"
> & {
  isNew: boolean;
};
export type VariantEditData = Pick<
  VariantResponse,
  | "label"
  | "price"
  | "groupId"
  | "storeIds"
  | "isPrimary"
  | "packagingCharges"
  | "itemId"
  | "_id"
  | "maxItemTypes"
  | "maxItems"
> & {
  isNew: boolean;
};

export type VariantGroupCreateData = Pick<
  VariantGroupResponse,
  "label" | "description" | "isPrimary" | "itemId" | "_id" | "storeIds"
> & {
  isNew: boolean;
};
export type VariantGroupEditData = Pick<
  VariantGroupResponse,
  "label" | "description" | "storeIds" | "isPrimary" | "itemId" | "_id"
> & {
  isNew: boolean;
};

export type VariantQueryParams = {
  search?: string;
  groupId?: string;
};
