export interface CategoryCreateData {
  name: string;
  imageUrl: string;
}

export interface CategoryUpdateData {
  name: string;
  imageUrl: string;
}

export interface CategoryResponse {
  _id: string;
  name: string;
  imageUrl: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  storeIds: string[];
}

// sub category

export interface SubCategoryCreateData {
  name: string;
  categoryId: string;
  imageUrl: string;
}

export interface SubCategoryUpdateData {
  name: string;
  categoryId: string;
  imageUrl: string;
}

export interface SubCategoryResponse {
  _id: string;
  name: string;
  imageUrl: string;
  categoryId: string;
  storeIds: string[];
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// common

export interface SortOrderUpdateEntry {
  categoryId: string;
  sortOrder: number;
}

export interface AssignStoreToCategoryId {
  storeId: string;
  isAvailable: boolean;
}

export interface CategoryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  storeId?: string;
  all?: boolean;
  categoryId?: string;
}
