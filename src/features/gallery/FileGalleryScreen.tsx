import { Button } from "@/components/base/Button";
import type { SelectOption } from "@/components/base/Select";
import DeleteDialog from "@/components/compound/DeleteDialog";
import Dialog from "@/components/compound/Dialog";
import ImageComponent from "@/components/compound/ImageComponent";
import MediaMoveTo from "@/components/compound/media-picker/MediaMoveTo";
import MediaPickerContent from "@/components/compound/media-picker/MediaPickerContent";
import { toast } from "@/components/compound/Sonner";
import { useToggle } from "@/hooks/useToggle";
import { fileApiService } from "@/infrastructure/FileApiService";
import type { FileResponse } from "@/types/file.types";
import { useCallback, useState } from "react";

export const FileGalleryScreen = () => {
  const [selectedMedia, setSelectedMedia] = useState<FileResponse[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<SelectOption>({
    label: "",
    value: "",
  });
  const {
    isOpen: isOpenDelete,
    open: openDelete,
    close: closeDelete,
  } = useToggle();
  const {
    close: closeMoveTo,
    isOpen: isOpenMoveTo,
    open: openMoveTo,
  } = useToggle();

  const footer = (
    <div className="flex items-center gap-2">
      <Button color="neutral" onClick={openMoveTo}>
        Move to{" "}
      </Button>
      <Button color="danger" onClick={openDelete}>
        Delete
      </Button>
    </div>
  );

  const {
    isOpen: isDeleing,
    open: startDeleting,
    close: closeDeleting,
  } = useToggle();
  const {
    isOpen: isMoving,
    open: startMoving,
    close: stopMoving,
  } = useToggle();

  const handleDelete = useCallback(async () => {
    const payload: string[] = selectedMedia.map((e) => e._id);
    if (payload.length > 0) {
      startDeleting();
      const { success, errorMessage } =
        await fileApiService.deleteFiles(payload);
      if (success) {
        closeDelete();
        toast.success("Files deleted successfully!");
      } else {
        toast.error(errorMessage ?? "Unable to delete files");
      }
    } else {
      toast.error(`No media selected`);
    }
    closeDeleting();
  }, [closeDeleting, selectedMedia, startDeleting, closeDelete]);
  const handleMoveTo = useCallback(async () => {
    const payload: string[] = selectedMedia.map((e) => e._id);
    if (payload.length > 0 && selectedGroup?.value) {
      startMoving();
      const { success, errorMessage } = await fileApiService.changeFolder(
        payload,
        selectedGroup.value,
      );
      if (success) {
        toast.success("Files moved successfully!");
        closeMoveTo();
      } else {
        toast.error(errorMessage ?? "Unable to move files");
      }
    } else {
      toast.error(`No media or group selected`);
    }
    stopMoving();
  }, [selectedGroup, selectedMedia, startMoving, stopMoving, closeMoveTo]);

  return (
    <div className="p-4">
      <MediaPickerContent
        multiple
        acceptedFormats={["image/png", "image/jpeg"]}
        close={() => {}}
        selectedMedia={selectedMedia}
        setSelectedMedia={setSelectedMedia}
        variant="screen"
        footer={selectedMedia.length > 0 ? footer : <></>}
      />
      <Dialog
        isOpen={isOpenMoveTo}
        close={closeMoveTo}
        title="Move to"
        actions={{
          primary: {
            label: "Move",
            onClick: handleMoveTo,
            loading: isMoving,
            disabled: !selectedGroup?.value,
          },
          secondary: {
            label: "Cancel",
            onClick: closeMoveTo,
          },
        }}
      >
        <MediaMoveTo
          selectedImages={selectedMedia}
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
        />
      </Dialog>
      <DeleteDialog
        close={closeDelete}
        isOpen={isOpenDelete}
        onDelete={handleDelete}
        name="below media"
        isDeleting={isDeleing}
        content={
          <div className="no-scrollbar mt-4 grid grid-cols-[repeat(auto-fill,minmax(5rem,1fr))] gap-1">
            {selectedMedia?.map((media, i) => (
              <ImageComponent
                alt={media.name}
                src={media.path}
                key={i}
                className="..."
              />
            ))}
          </div>
        }
      />
    </div>
  );
};
