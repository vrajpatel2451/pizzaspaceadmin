import type { FileResponse } from "@/types/file.types";
import { useState } from "react";
import type { DialogProps } from "../Dialog";
import Dialog from "../Dialog";
import MediaPickerContent from "./MediaPickerContent";

interface MediaPickerProps extends Pick<DialogProps, "isOpen" | "close"> {
  acceptedFormats?: string[];
  maxSizeMB?: number;
  multiple?: boolean;
  onError?: (error: string) => void;
  onMediaSelect?: (media: FileResponse | FileResponse[]) => void;
  onUploadComplete?: (media: FileResponse[]) => void;
}

const MediaPicker: React.FC<MediaPickerProps> = (props) => {
  const { isOpen, close, ...rest } = props;
  const [selectedMedia, setSelectedMedia] = useState<FileResponse[]>([]);

  return (
    <Dialog
      title="Media Picker"
      size="xl"
      close={close}
      isOpen={isOpen}
      subTitle="Select an image from your gallery or upload one from your device."
    >
      <MediaPickerContent
        close={close}
        selectedMedia={selectedMedia}
        setSelectedMedia={setSelectedMedia}
        variant="dialog"
        {...rest}
      />
    </Dialog>
  );
};

export default MediaPicker;
