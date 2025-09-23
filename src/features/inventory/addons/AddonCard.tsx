import { IconButton } from "@/components/base/IconButton";
import DeleteDialog from "@/components/compound/DeleteDialog";
import { toast } from "@/components/compound/Sonner";
import { useToggle } from "@/hooks/useToggle";
import { addonApiService } from "@/infrastructure/AddonApiService";
import type {
  AddonGroupResponse,
  AddonResponse,
  AddonWriteApiResponse,
} from "@/types/addon.types";
import { Pen, Trash } from "lucide-react";
import { useCallback, type FC } from "react";
import AddonCreateDialog from "./AddonCreateDialog";

type Props = {
  addonGroup: AddonGroupResponse;
  addons: AddonResponse[];
  onEdit: (apiResponse: AddonWriteApiResponse) => void;
  onDelete: (id: string) => void;
};

const AddonCard: FC<Props> = (props) => {
  const { addonGroup, addons, onEdit, onDelete: pOnDelete } = props;
  const { close, isOpen, open } = useToggle();
  const { _id, label } = addonGroup;
  const {
    close: closeDelete,
    isOpen: isDeleteOpen,
    open: openDelete,
  } = useToggle();
  const {
    isOpen: isDeleteInProgress,
    open: startDeleteProgress,
    close: stopDeleteProgress,
  } = useToggle();
  const onDelete = useCallback(async () => {
    startDeleteProgress();
    const { success } = await addonApiService.deleteGroup(_id);
    if (success) {
      close();
      pOnDelete(_id);
      toast.success("Addon deleted successfully");
    } else {
      toast.error("Error deleting Category");
    }
    stopDeleteProgress();
  }, [_id, close, pOnDelete, startDeleteProgress, stopDeleteProgress]);
  return (
    <div className="flex h-fit flex-col gap-4 rounded-lg bg-white p-4">
      {isOpen && (
        <AddonCreateDialog
          isOpen
          onClose={close}
          onSave={onEdit}
          addonGroup={addonGroup}
          addons={addons}
        />
      )}
      {isDeleteOpen && (
        <DeleteDialog
          isOpen
          close={closeDelete}
          onDelete={onDelete}
          isDeleting={isDeleteInProgress}
          name={label}
          title="Delete Addon?"
        />
      )}
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col">
          <div className="text-xl">{addonGroup.label}</div>
          <div className="text-pl-500 text-sm font-semibold">
            {addons?.length || 0} Addons
          </div>
        </div>
        <div className="flex items-center gap-4">
          <IconButton icon={Pen} onClick={open} />
          <IconButton icon={Trash} onClick={openDelete} />
        </div>
      </div>
      <div className="text-nl-500 text-xs">{addonGroup.description}</div>
    </div>
  );
};

export default AddonCard;
