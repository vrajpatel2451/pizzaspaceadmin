import { Button } from "@/components/base/Button";
import { IconButton } from "@/components/base/IconButton";
import Breadcrumbs, {
  type BreadcrumbItem,
} from "@/components/compound/Breadcrumbs";
import DeleteDialog from "@/components/compound/DeleteDialog";
import { toast } from "@/components/compound/Sonner";
import { Table, type TableColumn } from "@/components/compound/table/Table";
import { useToggle } from "@/hooks/useToggle";
import { openingHoursApiService } from "@/infrastructure/OpeningHoursApiService";
import { routeConstants } from "@/routes/routeConstants";
import type { OpeningHoursResponse } from "@/types/openingHours.types";
import { Pen, Plus, Trash } from "lucide-react";
import { useCallback, type FC } from "react";
import OpeningHoursDialog from "./OpeningHoursDialog";
import { useFetchOpeningHoursList } from "./hooks";

const OpeningHoursScreen = () => {
  const { data: list, isFetching, refetch } = useFetchOpeningHoursList();

  const columns: TableColumn<OpeningHoursResponse>[] = [
    {
      header: "Day",
      accessor: "day",
    },
    {
      header: "Start Time",
      accessor: "startTime",
    },
    {
      header: "End Time",
      accessor: "endTime",
    },
    {
      header: "Sort Order",
      accessor: "sortOrder",
    },
    {
      header: "Actions",
      accessor: "_id",
      cell: (_, row) => (
        <OpeningHoursActions openingHours={row} onRefresh={refetch} />
      ),
    },
  ];

  const { close, isOpen, open } = useToggle();

  return (
    <div className="flex flex-col gap-4 p-4">
      {isOpen && <OpeningHoursDialog onClose={close} onSave={refetch} isOpen />}
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
  openingHours: OpeningHoursResponse;
  onRefresh: () => void;
};

const OpeningHoursActions: FC<ActionsProps> = (props) => {
  const { openingHours, onRefresh } = props;
  const { _id, day } = openingHours;
  const { isOpen, open, close } = useToggle();
  const { isOpen: isEditOpen, open: openEdit, close: closeEdit } = useToggle();
  const {
    isOpen: isDeleteInProgress,
    open: startDeleteProgress,
    close: stopDeleteProgress,
  } = useToggle();

  const onDelete = useCallback(async () => {
    startDeleteProgress();
    const { success } = await openingHoursApiService.deleteOpeningHours(_id);
    if (success) {
      close();
      onRefresh();
      toast.success("Opening hours deleted successfully");
    } else {
      toast.error("Error deleting opening hours");
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
          title="Delete Opening Hours!"
          name={day}
        />
      )}
      {isEditOpen && (
        <OpeningHoursDialog
          onClose={closeEdit}
          onSave={onRefresh}
          isOpen
          openingHours={openingHours}
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
    label: "Opening Hours",
    to: routeConstants.openingHours,
  },
];

export default OpeningHoursScreen;
