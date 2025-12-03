// Opening Hours Types

export interface OpeningHoursResponse {
  _id: string;
  day: string;
  startTime: string;
  endTime: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface OpeningHoursCreateData {
  day: string;
  startTime: string;
  endTime: string;
  sortOrder: number;
}

export interface OpeningHoursUpdateData {
  day?: string;
  startTime?: string;
  endTime?: string;
  sortOrder?: number;
}
