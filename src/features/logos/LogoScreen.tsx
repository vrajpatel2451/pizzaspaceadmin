import { Button } from "@/components/base/Button";
import { IconButton } from "@/components/base/IconButton";
import Switch from "@/components/base/Switch";
import Breadcrumbs, {
  type BreadcrumbItem,
} from "@/components/compound/Breadcrumbs";
import DeleteDialog from "@/components/compound/DeleteDialog";
import ImageComponent from "@/components/compound/ImageComponent";
import { toast } from "@/components/compound/Sonner";
import { Table, type TableColumn } from "@/components/compound/table/Table";
import { useToggle } from "@/hooks/useToggle";
import { logoApiService } from "@/infrastructure/LogoApiService";
import { routeConstants } from "@/routes/routeConstants";
import type { LogoResponse } from "@/types/logo.types";
import { Pen, Plus, Trash } from "lucide-react";
import { useCallback, type FC } from "react";
import LogoDialog from "./LogoDialog";
import { useFetchLogosList } from "./hooks";

const LogoScreen = () => {
  const { data: list, isFetching, refetch, setData } = useFetchLogosList();

  const handlePublishToggle = useCallback(
    async (id: string, currentStatus: boolean) => {
      const { success, data: updatedData } = await logoApiService.updateLogo(
        id,
        {
          isPublished: !currentStatus,
        }
      );
      if (success && updatedData) {
        setData((prev) => ({
          ...prev,
          data: prev.data.map((item) =>
            item._id === id ? updatedData : item
          ),
        }));
        toast.success(
          `Logo ${!currentStatus ? "published" : "unpublished"} successfully`
        );
      } else {
        toast.error("Failed to update publish status");
      }
    },
    [setData]
  );

  const columns: TableColumn<LogoResponse>[] = [
    {
      header: "Logo",
      accessor: "logoImage",
      cell: (val, row) => (
        <ImageComponent
          alt={`${row.type} ${row.theme} logo`}
          src={val}
          className="size-12 rounded-md object-contain"
        />
      ),
    },
    {
      header: "Type",
      accessor: "type",
      cell: (val) => (
        <span className="capitalize">{val}</span>
      ),
    },
    {
      header: "Theme",
      accessor: "theme",
      cell: (val) => (
        <span className="capitalize">{val}</span>
      ),
    },
    {
      header: "Published",
      accessor: "isPublished",
      cell: (val, row) => (
        <Switch
          checked={val}
          setChecked={() => handlePublishToggle(row._id, val)}
          size="sm"
        />
      ),
    },
    {
      header: "Actions",
      accessor: "_id",
      cell: (_, row) => <LogoActions logo={row} onRefresh={refetch} />,
    },
  ];

  const { close, isOpen, open } = useToggle();

  return (
    <div className="flex flex-col gap-4 p-4">
      {isOpen && <LogoDialog onClose={close} onSave={refetch} isOpen />}
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
  logo: LogoResponse;
  onRefresh: () => void;
};

const LogoActions: FC<ActionsProps> = (props) => {
  const { logo, onRefresh } = props;
  const { _id, type, theme } = logo;
  const { isOpen, open, close } = useToggle();
  const { isOpen: isEditOpen, open: openEdit, close: closeEdit } = useToggle();
  const {
    isOpen: isDeleteInProgress,
    open: startDeleteProgress,
    close: stopDeleteProgress,
  } = useToggle();

  const onDelete = useCallback(async () => {
    startDeleteProgress();
    const { success } = await logoApiService.deleteLogo(_id);
    if (success) {
      close();
      onRefresh();
      toast.success("Logo deleted successfully");
    } else {
      toast.error("Error deleting logo");
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
          title="Delete Logo!"
          name={`${type} ${theme}`}
        />
      )}
      {isEditOpen && (
        <LogoDialog
          onClose={closeEdit}
          onSave={onRefresh}
          isOpen
          logo={logo}
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
    label: "Logos",
    to: routeConstants.logos,
  },
];

export default LogoScreen;
