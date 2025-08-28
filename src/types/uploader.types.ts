// import type { PaginationQueryParams } from "./general.types";

// export type FileType = "image" | "file" | "video";

// export type Uploader =
//   | "customer"
//   | "seller_owner"
//   | "seller_staff"
//   | "rider"
//   | "staff";

// export interface UploadMeta {
//   type: FileType;
//   uploader: Uploader;
//   group: string;
//   size: string;
// }

// export interface UploadResult {
//   _id: string;
//   type: string;
//   path: string;
//   name: string;
//   uploader: UploadMeta["uploader"];
//   group: UploadMeta["group"];
//   size: number;
//   uniqueId: string;
//   createdDate: number;
// }

// export interface GetGroupMediaListQueryParams extends PaginationQueryParams {
//   group: string;
//   search?: string;
// }
