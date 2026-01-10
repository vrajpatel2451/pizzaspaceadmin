import { Button } from "@/components/base/Button";
import type { SelectOption } from "@/components/base/Select";
import DeleteDialog from "@/components/compound/DeleteDialog";
import Dialog from "@/components/compound/Dialog";
import ImageComponent from "@/components/compound/ImageComponent";
import MediaMoveTo from "@/components/compound/media-picker/MediaMoveTo";
import MediaPickerContent from "@/components/compound/media-picker/MediaPickerContent";
import { toast } from "@/components/compound/Sonner";
import ScreenContainer from "@/components/shared/ScreenContainer";
import { useToggle } from "@/hooks/useToggle";
import { fileApiService } from "@/infrastructure/FileApiService";
import type { FileResponse } from "@/types/file.types";
import { FolderOpen, Trash2 } from "lucide-react";
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
        setSelectedMedia([]);
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
        setSelectedMedia([]);
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
    <ScreenContainer>
      {selectedMedia.length > 0 && (
        <div className="flex items-center justify-end gap-3">
          <span className="text-sm text-slate-500">
            {selectedMedia.length} {selectedMedia.length === 1 ? "item" : "items"} selected
          </span>
          <Button
            variant="outline"
            color="neutral"
            size="sm"
            startIcon={<FolderOpen size={16} />}
            onClick={openMoveTo}
          >
            Move to
          </Button>
          <Button
            variant="outline"
            color="danger"
            size="sm"
            startIcon={<Trash2 size={16} />}
            onClick={openDelete}
          >
            Delete
          </Button>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <MediaPickerContent
          multiple
          acceptedFormats={["image/png", "image/jpeg", "image/webp", "image/gif"]}
          close={() => {}}
          selectedMedia={selectedMedia}
          setSelectedMedia={setSelectedMedia}
          variant="screen"
        />
      </div>

      <Dialog
        isOpen={isOpenMoveTo}
        close={closeMoveTo}
        title="Move to Folder"
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
        name="selected media"
        isDeleting={isDeleing}
        content={
          <div className="no-scrollbar mt-4 grid grid-cols-[repeat(auto-fill,minmax(5rem,1fr))] gap-2">
            {selectedMedia?.map((media, i) => (
              <div key={i} className="overflow-hidden rounded-lg border border-slate-200">
                <ImageComponent
                  alt={media.name}
                  src={media.path}
                  className="aspect-square h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        }
      />
    </ScreenContainer>
  );
};
