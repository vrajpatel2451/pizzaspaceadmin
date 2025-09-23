export interface AddonResponse {
  _id: string;
  label: string;
  price: number;
  groupId: string;
  storeIds: string[];
  createdAt: string;
  updatedAt: string;
  uiKey?: string;
}

export interface AddonGroupResponse {
  _id: string;
  label: string;
  allowMulti: boolean;
  min: number;
  max: number;
  description: string;
  storeIds: string[];
  createdAt: string;
  updatedAt: string;
}

export type AddonCreateData = Pick<AddonResponse, "label" | "price">;
export type AddonEditData = Pick<
  AddonResponse,
  "label" | "price" | "groupId" | "storeIds"
> & {
  _id?: string;
};

export type AddonGroupCreateData = Pick<
  AddonGroupResponse,
  "label" | "description" | "allowMulti" | "min" | "max"
>;
export type AddonGroupEditData = Pick<
  AddonGroupResponse,
  "label" | "description" | "storeIds" | "allowMulti" | "min" | "max" | "_id"
>;

export type AddonQueryParams = {
  search?: string;
  allowMulti?: boolean;
  groupId?: string;
};

export interface AddonApiResponse {
  addons: AddonResponse[];
  addonGroups: AddonGroupResponse[];
}
export interface AddonWriteApiResponse {
  addons: AddonResponse[];
  addonGroup: AddonGroupResponse;
}
export interface AddonBulkGetParams {
  storeId?: string;
  addonIds?: string[];
  addonGroupIds?: string[];
}
export interface AddAddonBulkGetParams {
  addonGroup: AddonGroupCreateData;
  addons: AddonCreateData[];
}
export interface EditAddonBulkGetParams {
  addonGroup: AddonGroupEditData;
  addons: AddonEditData[];
  deletedIds: string[];
}
