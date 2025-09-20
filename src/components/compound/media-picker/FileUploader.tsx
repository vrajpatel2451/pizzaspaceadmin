import { Button } from "@/components/base/Button";
import { IconButton } from "@/components/base/IconButton";
import type { SelectOption } from "@/components/base/Select";
import { useFileUpload } from "@/hooks/useUploadFile";
import type {
  FileResponse,
  MediaTypeEnum,
  UploadFileRequest,
} from "@/types/file.types";
import { getFileExtension, showErrorToasts } from "@/utils/helpers";
import {
  CheckCircle,
  File as FileIcon,
  Upload,
  X,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import ImageComponent from "../ImageComponent";
import GroupSelector from "./GroupSelector";

export interface FileUploaderProps {
  multiple?: boolean;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  onUploadComplete?: (media: FileResponse[]) => void;
  onError?: (error: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  multiple = false,
  maxSizeMB = 10,
  acceptedFormats = ["image/*", "application/pdf"],
  onUploadComplete,
  onError,
}) => {
  const { uploadFile, progress, resetProgress } = useFileUpload();
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<SelectOption>({
    label: "",
    value: "",
  });
  // const qc = queryClient;
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const newFiles = Array.from(e.dataTransfer.files);

    const validFiles = newFiles.filter((file) => {
      if (file.size / 1024 / 1024 > maxSizeMB) {
        setError(`File ${file.name} exceeds ${maxSizeMB}MB`);
        return false;
      }
      if (
        acceptedFormats.length &&
        !acceptedFormats.some((format) => file.type.match(format))
      ) {
        setError(`File ${file.name} is not an accepted format`);
        return false;
      }
      return true;
    });

    if (multiple) {
      setFiles((prev) => [...prev, ...validFiles]);
    } else {
      if (validFiles.length > 0) {
        setFiles([validFiles[0]]);
      }

      if (newFiles.length > 1) {
        setError("Only one file is allowed. Using the first valid file.");
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    const validFiles = selectedFiles.filter((file) => {
      if (file.size / 1024 / 1024 > maxSizeMB) {
        setError(`File ${file.name} exceeds ${maxSizeMB}MB`);
        return false;
      }
      if (
        acceptedFormats.length &&
        !acceptedFormats.some((format) => file.type.match(format))
      ) {
        setError(`File ${file.name} is not an accepted format`);
        return false;
      }
      return true;
    });

    if (multiple) {
      setFiles((prev) => [...prev, ...validFiles]);
    } else {
      if (validFiles.length > 0) {
        setFiles([validFiles[0]]);
      }
    }

    e.target.value = "";
  };

  const getFileType = (file: File): MediaTypeEnum => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    return "file";
  };

  const getFileSize = (file: File): string => {
    const sizeInMB = file.size;
    return sizeInMB.toString();
  };

  const handleUpload = async () => {
    if (!files.length) return;

    setUploading(true);
    setError(null);

    try {
      const uploadedMedia: FileResponse[] = [];
      for (const file of files) {
        const meta: UploadFileRequest = {
          type: getFileType(file),
          folder: selectedGroup?.value,
          size: getFileSize(file),
        };
        const res: FileResponse = await uploadFile(file, meta);

        uploadedMedia.push(res);
      }

      setUploadedUrls(uploadedMedia.map((m) => m.path));
      onUploadComplete?.(uploadedMedia);
      setFiles([]);
    } catch (err: any) {
      showErrorToasts(err.response.data);
      setError(err.response.data.message || "Upload failed");
      onError?.(err.response.data.message);
    } finally {
      setUploading(false);
      resetProgress();
    }
  };

  const removeFile = (file: File) => {
    setFiles((prev) => {
      const newFiles = prev.filter((f) => f !== file);

      if (newFiles.length === 0) {
        setError(null);
      }
      return newFiles;
    });
  };

  const isImage = (file: File) => !!file.type && file.type.startsWith("image/");

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="mx-auto w-full">
      {(multiple || files.length < 1) && (
        <label className="block cursor-pointer">
          <input
            type="file"
            multiple={multiple}
            accept={acceptedFormats.join(",")}
            onChange={handleFileSelect}
            className="sr-only"
          />
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-nl-200 dark:border-nd-400/60 bg-nl-50/50 dark:bg-nd-700 hover:bg-nl-100/80 hover:dark:bg-nd-600 cursor-pointer rounded-2xl border-2 border-dashed py-10 text-center backdrop-blur-md transition-all"
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="text-nl-600 dark:text-nd-200 mt-6">
              Drag & drop files here, or click to select
            </p>
            <p className="text-nl-500 dark:text-nd-300 mt-1">
              Max {maxSizeMB}MB,{" "}
              {multiple ? "multiple files allowed" : "1 file only"}
            </p>
          </div>
        </label>
      )}

      {files.length > 0 && (
        <div className="mt-6">
          <GroupSelector
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
            defaultGroup="profile"
          />
          <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-1">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="bg-nl-50/30 dark:bg-nd-600 relative flex flex-col items-center justify-center rounded-lg p-3 text-center shadow-md transition hover:shadow-lg"
              >
                <IconButton
                  icon={X}
                  onClick={() => removeFile(file)}
                  className="absolute top-2 right-2"
                />

                {isImage(file) ? (
                  <ImageComponent
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="mb-2 h-24 w-24 rounded-lg object-contain"
                  />
                ) : (
                  <FileIcon className="mb-2 h-12 w-12 text-gray-400" />
                )}

                <div className="w-full text-center">
                  <p className="w-full truncate text-xs text-gray-300">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getFileExtension(file)}
                    {" - "}
                    {formatFileSize(file.size)}
                  </p>
                </div>

                {uploading && (
                  <div className="mt-2 w-full">
                    <div className="h-1.5 overflow-hidden rounded-full bg-gray-700">
                      <div
                        className="h-1.5 bg-blue-500 transition-all duration-300 ease-in-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-6 flex justify-end gap-x-2">
          <Button color="neutral" onClick={() => setFiles([])}>
            Discard
          </Button>
          <Button onClick={handleUpload} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      )}

      {error && (
        <p className="mt-4 flex items-center gap-2 text-red-400">
          <XCircle className="h-5 w-5" /> {error}
        </p>
      )}

      {uploadedUrls.length > 0 && (
        <p className="mt-4 flex items-center gap-2 text-green-400">
          <CheckCircle className="h-5 w-5" /> Upload complete!
        </p>
      )}
    </div>
  );
};

export default FileUploader;
