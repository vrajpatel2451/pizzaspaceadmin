import { Button } from "@/components/base/Button";
import { IconButton } from "@/components/base/IconButton";
import Switch from "@/components/base/Switch";
import DeleteDialog from "@/components/compound/DeleteDialog";
import ImageComponent from "@/components/compound/ImageComponent";
import { toast } from "@/components/compound/Sonner";
import { Table, type TableColumn } from "@/components/compound/table/Table";
import EmptyState from "@/components/shared/EmptyState";
import FilterBar from "@/components/shared/FilterBar";
import ScreenContainer from "@/components/shared/ScreenContainer";
import { useToggle } from "@/hooks/useToggle";
import { logoApiService } from "@/infrastructure/LogoApiService";
import type { LogoResponse } from "@/types/logo.types";
import { Image, Pen, Plus, Trash } from "lucide-react";
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
      header: "Preview",
      accessor: "logoImage",
      cell: (val, row) => (
        <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-slate-200 bg-white p-2">
          <ImageComponent
            alt={`${row.type} ${row.theme} logo`}
            src={val}
            className="h-full w-full object-contain"
          />
        </div>
      ),
    },
    {
      header: "Type",
      accessor: "type",
      cell: (val) => (
        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-medium capitalize text-slate-700">
          {val}
        </span>
      ),
    },
    {
      header: "Theme",
      accessor: "theme",
      cell: (val) => (
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium capitalize ${
            val === "dark"
              ? "bg-slate-800 text-white"
              : "border border-slate-200 bg-white text-slate-700"
          }`}
        >
          {val}
        </span>
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

  const isEmpty = !isFetching && (!list || list.length === 0);

  return (
    <ScreenContainer>
      {isOpen && <LogoDialog onClose={close} onSave={refetch} isOpen />}

      <FilterBar
        className="mb-4"
        actions={
          <Button startIcon={<Plus size={18} />} onClick={open}>
            Upload Logo
          </Button>
        }
      />

      {isEmpty ? (
        <EmptyState
          icon={Image}
          title="No logos uploaded yet"
          description="Upload your brand logos for light and dark themes to maintain consistent branding across your website."
          actionLabel="Upload Logo"
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

export default LogoScreen;
