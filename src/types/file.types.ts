export type MediaTypeEnum = "image" | "file" | "video";

export type FileResponse = {
  _id: string;
  name: string;
  path: string;
  folder: string;
  fileType: MediaTypeEnum;
  uploadedBy: string;
  size: number;
  createdAt: string;
  updatedAt: string;
};

export interface FileQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  folder?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface UploadFileRequest {
  type: MediaTypeEnum;
  folder: string;
  size: string;
}
export interface DeleteFileRequest {
  mediaIds: string[];
}
export interface ChangeFolderRequest {
  mediaIds: string[];
  folder: string;
}

export enum MediaPickerModes {
  gallery = "gallery",
  uploader = "uploader",
}
