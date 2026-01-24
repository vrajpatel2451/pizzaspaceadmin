// General Rating Types

export interface GeneralRatingResponse {
  _id: string;
  personName: string;
  message: string;
  personImage?: string;
  ratings: number;
  personTagRole?: string;
  isPublished: boolean;
  personPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GeneralRatingCreateData {
  personName: string;
  message: string;
  personImage?: string;
  ratings: number;
  personTagRole?: string;
  personPhone?: string;
}

export interface GeneralRatingUpdateData {
  personName?: string;
  personImage?: string;
  message?: string;
  ratings?: number;
  personTagRole?: string;
  isPublished?: boolean;
  personPhone?: string;
}

export interface GeneralRatingQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  isAscending?: boolean;
  isPublished?: boolean;
}
