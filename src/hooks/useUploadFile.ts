import type { BaseApiResponse } from "@/types/baseApi.types";
import type { FileResponse, UploadFileRequest } from "@/types/file.types";
import { LocalStorageUtil } from "@/utils/localStorageUtil";
import axios from "axios";
import { useCallback, useState } from "react";

interface UseFileUploadResult {
  uploadFile: (file: File, meta: UploadFileRequest) => Promise<FileResponse>;
  progress: number;
  resetProgress: () => void;
}

const UPLOAD_URL = import.meta.env.VITE_SERVER_URL + "/file/upload";

export function useFileUpload(): UseFileUploadResult {
  const [progress, setProgress] = useState<number>(0);

  const uploadFile = useCallback(
    async (file: File, meta: UploadFileRequest): Promise<FileResponse> => {
      const formData = new FormData();
      const { folder, size, type } = meta || {};
      formData.append("file", file);
      formData.append("type", type);
      formData.append("folder", folder);
      formData.append("size", size);

      const token = LocalStorageUtil.getItem("staff_access_token");
      const response = await axios.post<BaseApiResponse<FileResponse>>(
        UPLOAD_URL,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (event) => {
            if (event.total) {
              setProgress(Math.round((event.loaded * 100) / event.total));
            }
          },
        },
      );

      return response.data.data;
    },
    [],
  );

  const resetProgress = () => setProgress(0);

  return { uploadFile, progress, resetProgress };
}
