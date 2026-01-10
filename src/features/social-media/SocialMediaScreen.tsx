import { Button } from "@/components/base/Button";
import { IconButton } from "@/components/base/IconButton";
import DeleteDialog from "@/components/compound/DeleteDialog";
import ImageComponent from "@/components/compound/ImageComponent";
import { toast } from "@/components/compound/Sonner";
import { Table, type TableColumn } from "@/components/compound/table/Table";
import EmptyState from "@/components/shared/EmptyState";
import FilterBar from "@/components/shared/FilterBar";
import ScreenContainer from "@/components/shared/ScreenContainer";
import { useToggle } from "@/hooks/useToggle";
import { socialMediaApiService } from "@/infrastructure/SocialMediaApiService";
import type { SocialMediaResponse } from "@/types/socialMedia.types";
import { ExternalLink, Pen, Plus, Share2, Trash } from "lucide-react";
import { useCallback, type FC } from "react";
import SocialMediaDialog from "./SocialMediaDialog";
import { useFetchSocialMediaList } from "./hooks";

const SocialMediaScreen = () => {
  const { data: list, isFetching, refetch } = useFetchSocialMediaList();

  const columns: TableColumn<SocialMediaResponse>[] = [
    {
      header: "Platform",
      accessor: "name",
      cell: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
            <ImageComponent
              alt={val + " logo"}
              src={row.logo}
              className="h-6 w-6 object-contain"
            />
          </div>
          <span className="font-medium text-slate-800">{val}</span>
        </div>
      ),
    },
    {
      header: "Link",
      accessor: "link",
      cell: (val) => (
        <a
          href={val}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex max-w-[280px] items-center gap-2 text-orange-600 hover:text-orange-700"
        >
          <span className="truncate">{val}</span>
          <ExternalLink size={14} className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
        </a>
      ),
    },
    {
      header: "Actions",
      accessor: "_id",
      cell: (_, row) => (
        <SocialMediaActions socialMedia={row} onRefresh={refetch} />
      ),
    },
  ];

  const { close, isOpen, open } = useToggle();

  const isEmpty = !isFetching && (!list || list.length === 0);

  return (
    <ScreenContainer>
      {isOpen && <SocialMediaDialog onClose={close} onSave={refetch} isOpen />}

      <FilterBar
        className="mb-4"
        actions={
          <Button startIcon={<Plus size={18} />} onClick={open}>
            Add Social Link
          </Button>
        }
      />

      {isEmpty ? (
        <EmptyState
          icon={Share2}
          title="No social media links yet"
          description="Connect your social media accounts to help customers find and follow you online."
          actionLabel="Add Social Link"
          onAction={open}
        />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white">
          <Table
            columns={columns}
            data={list}
            isLoading={isFetching}
            isMuted={isFetching}
          />
        </div>
      )}
    </ScreenContainer>
  );
};

type ActionsProps = {
  socialMedia: SocialMediaResponse;
  onRefresh: () => void;
};

const SocialMediaActions: FC<ActionsProps> = (props) => {
  const { socialMedia, onRefresh } = props;
  const { _id, name } = socialMedia;
  const { isOpen, open, close } = useToggle();
  const { isOpen: isEditOpen, open: openEdit, close: closeEdit } = useToggle();
  const {
    isOpen: isDeleteInProgress,
    open: startDeleteProgress,
    close: stopDeleteProgress,
  } = useToggle();

  const onDelete = useCallback(async () => {
    startDeleteProgress();
    const { success } = await socialMediaApiService.deleteSocialMedia(_id);
    if (success) {
      close();
      onRefresh();
      toast.success("Social media deleted successfully");
    } else {
      toast.error("Error deleting social media");
    }
    stopDeleteProgress();
  }, [_id, close, onRefresh, startDeleteProgress, stopDeleteProgress]);

  return (
    <div className="flex items-center gap-2">
      {isOpen && (
        <DeleteDialog
          close={close}
          isOpen
          onDelete={onDelete}
          isDeleting={isDeleteInProgress}
          title="Delete Social Media!"
          name={name}
        />
      )}
      {isEditOpen && (
        <SocialMediaDialog
          onClose={closeEdit}
          onSave={onRefresh}
          isOpen
          socialMedia={socialMedia}
        />
      )}
      <IconButton icon={Pen} onClick={openEdit} />
      <IconButton icon={Trash} onClick={open} />
    </div>
  );
};

export default SocialMediaScreen;
