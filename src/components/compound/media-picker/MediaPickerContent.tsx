// MediaPickerContent.tsx
import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import { useInputState } from "@/hooks/useInputState";
import { MediaPickerModes, type FileResponse } from "@/types/file.types";
import { SearchIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import ToggleButtonGroup, {
  type ToggleButtonListItem,
} from "../ToggleButtonGroup";
import FileUploader from "./FileUploader";
import MediaGallery from "./MediaGallery";

interface MediaPickerContentProps {
  acceptedFormats?: string[];
  maxSizeMB?: number;
  multiple?: boolean;
  onError?: (error: string) => void;
  onMediaSelect?: (media: FileResponse | FileResponse[]) => void;
  onUploadComplete?: (media: FileResponse[]) => void;
  close: () => void;
  variant?: "dialog" | "screen";
  selectedMedia: FileResponse[];
  setSelectedMedia: React.Dispatch<React.SetStateAction<FileResponse[]>>;
  footer?: ReactNode;
}

const MediaPickerContent: React.FC<MediaPickerContentProps> = ({
  acceptedFormats,
  maxSizeMB,
  multiple,
  onError,
  onUploadComplete,
  onMediaSelect,
  close,
  variant,
  selectedMedia,
  setSelectedMedia,
  footer,
}) => {
  const [mode, setMode] = useState<ToggleButtonListItem>(toggleButtonList[0]);
  const { inputValue, onInputChange } = useInputState();

  const onButtonChange = (button: ToggleButtonListItem) => {
    setMode(button);
    setSelectedMedia([]);
  };

  const handleImageClick = (media: FileResponse) => {
    setSelectedMedia((prev) => {
      const exists = prev.find((m) => m.path === media.path);
      if (multiple) {
        return exists
          ? prev.filter((m) => m.path !== media.path)
          : [...prev, media];
      } else {
        return exists ? [] : [media];
      }
    });
  };

  const handleConfirmSelection = () => {
    if (selectedMedia.length > 0) {
      onMediaSelect?.(multiple ? selectedMedia : selectedMedia[0]);
      onUploadComplete?.(selectedMedia);
      setSelectedMedia([]);
      close();
    }
  };

  const handleCancel = () => {
    setSelectedMedia([]);
    close();
  };

  const isGallery = mode.value === MediaPickerModes.gallery;

  return (
    <>
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div className="w-full md:max-w-[20rem]">
          <ToggleButtonGroup
            buttonList={toggleButtonList}
            onChange={onButtonChange}
            selected={mode}
            fullWidth
          />
        </div>
        {isGallery && (
          <div className="flex items-center gap-2">
            <Input
              leftElement={<SearchIcon size={18} strokeWidth={1} />}
              placeholder={"Search"}
              value={inputValue}
              onChange={onInputChange}
            />
          </div>
        )}
      </div>

      <div className="mt-6">
        {isGallery ? (
          <MediaGallery
            onImageClick={handleImageClick}
            multiple={multiple}
            selectedMedia={selectedMedia}
            searchVal={inputValue}
          />
        ) : (
          <FileUploader
            acceptedFormats={acceptedFormats}
            maxSizeMB={maxSizeMB}
            multiple={multiple}
            onError={onError}
            onUploadComplete={onUploadComplete}
          />
        )}
      </div>

      {isGallery && (
        <div className="mt-4 flex items-center gap-2">
          {selectedMedia.length > 0 && (
            <p className="text-nl-700 dark:text-nd-200 text-sm">
              {selectedMedia.length} {multiple ? "items" : "item"} selected
            </p>
          )}
          <Button color="neutral" className="ml-auto" onClick={handleCancel}>
            Cancel
          </Button>
          {variant === "dialog" && (
            <Button
              onClick={handleConfirmSelection}
              disabled={selectedMedia.length === 0}
            >
              Select {selectedMedia.length > 0 && `(${selectedMedia.length})`}
            </Button>
          )}
          {footer && footer}
        </div>
      )}
    </>
  );
};

export default MediaPickerContent;

const toggleButtonList: ToggleButtonListItem[] = [
  { label: "Gallery", value: MediaPickerModes.gallery },
  { label: "Upload", value: MediaPickerModes.uploader },
];
