import { Button } from "@/components/base/Button";
import { IconButton } from "@/components/base/IconButton";
import Breadcrumbs, {
  type BreadcrumbItem,
} from "@/components/compound/Breadcrumbs";
import DeleteDialog from "@/components/compound/DeleteDialog";
import ImageComponent from "@/components/compound/ImageComponent";
import { toast } from "@/components/compound/Sonner";
import { Table, type TableColumn } from "@/components/compound/table/Table";
import { useToggle } from "@/hooks/useToggle";
import { socialMediaApiService } from "@/infrastructure/SocialMediaApiService";
import { routeConstants } from "@/routes/routeConstants";
import type { SocialMediaResponse } from "@/types/socialMedia.types";
import { Pen, Plus, Trash } from "lucide-react";
import { useCallback, type FC } from "react";
import SocialMediaDialog from "./SocialMediaDialog";
import { useFetchSocialMediaList } from "./hooks";

const SocialMediaScreen = () => {
  const { data: list, isFetching, refetch } = useFetchSocialMediaList();

  const columns: TableColumn<SocialMediaResponse>[] = [
    {
      header: "Logo",
      accessor: "logo",
      cell: (val, row) => (
        <ImageComponent
          alt={row.name + " logo"}
          src={val}
          className="size-10 rounded-md object-contain"
        />
      ),
    },
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Link",
      accessor: "link",
      cell: (val) => (
        <a
          href={val}
          target="_blank"
          rel="noopener noreferrer"
          className="max-w-[200px] truncate text-blue-600 hover:underline dark:text-blue-400"
        >
          {val}
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

  return (
    <div className="flex flex-col gap-4 p-4">
      {isOpen && <SocialMediaDialog onClose={close} onSave={refetch} isOpen />}
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="flex w-full items-center justify-end">
        <Button
          startIcon={<Plus className="text-white" size={20} />}
          onClick={open}
        >
          Create
        </Button>
      </div>

      <Table
        className="mt-4"
        columns={columns}
        data={list}
        isLoading={isFetching}
        isMuted={isFetching}
      />
    </div>
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

const breadcrumbs: BreadcrumbItem[] = [
  {
    label: "Dashboard",
    to: routeConstants.dashboard,
  },
  {
    label: "Social Media",
    to: routeConstants.socialMedia,
  },
];

export default SocialMediaScreen;
