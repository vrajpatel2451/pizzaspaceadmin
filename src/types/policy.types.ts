// Policy Types

export interface PolicyListResponse {
  _id: string;
  name: string;
  slug: string;
  showOnFooter: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PolicyResponse {
  _id: string;
  name: string;
  content: string;
  slug: string;
  showOnFooter: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PolicyCreateData {
  name: string;
  content: string;
  slug: string;
  showOnFooter?: boolean;
}

export interface PolicyUpdateData {
  name?: string;
  content?: string;
  slug?: string;
  showOnFooter?: boolean;
}
